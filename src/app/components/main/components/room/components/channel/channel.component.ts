import { Location } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AxiosError } from 'axios';
import { Subject, delay, timeout } from 'rxjs';
import { ChannelDTO } from 'src/common/models/channelDTO.interface';
import { RequestService } from 'src/common/services/request.service';
import { WebSocketService } from 'src/common/services/web-socket.service';
import Swal from 'sweetalert2';
import videojs from 'video.js';
import { Mutex } from 'async-mutex';
import { Constants } from 'src/common/constants';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})

export class ChannelComponent implements AfterViewInit, OnInit, OnChanges {

  private mutex = new Mutex();

  constructor(private requestService: RequestService,
    private location: Location,
    private websocketService: WebSocketService
  ) {
    this.websocketService.getChannelUpdate$().subscribe((next: ChannelDTO) => {
      if (this.id == "channelId" + next._id) {
        this.live = next.isLive;
      }
    });
    this.websocketService.getMotionDetected$().subscribe(async (name: string) => {
      if (name == this.deviceName) {
        const release = await this.mutex.acquire();
        try {
          this.isMotionDetected = true;
          await new Promise(resolve => setTimeout(resolve, 3000));
          this.isMotionDetected = false;
        }
        finally {
          release();
        }
      }
    });
  }

  @Input() group: string = '';
  @Input() id: string = '';
  @Input() recording: boolean = false;
  @Input() isBlocked!: boolean;
  @Output() roomRecordCheck: EventEmitter<string> = new EventEmitter<string>();
  @Output() channelBlock: EventEmitter<void> = new EventEmitter<void>();
  live!: boolean;
  isMotionDetected: boolean = false;//has something moved
  enableMotionDetection: boolean = true;//to check for motion setection
  deviceName: string = '';
  waitingHandler: boolean = true;
  player: any;
  url: string = "";
  readonly POSTER_URL: string = "channelBlockedIcon.png";

  public async ngOnInit(): Promise<void> {
    const channel: ChannelDTO = await this.requestService.getChannel(this.id.substring(9));
    this.recording = channel.isRecording;
    this.enableMotionDetection = channel.enableMotionDetection;
    this.live = channel.isLive;
    this.isBlocked = channel.isBlocked;
    this.deviceName = channel.device.title;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    try {
      if (changes["isBlocked"].previousValue != this.isBlocked) {
        if (this.isBlocked) {
          this.player.src(this.url);
          this.player.poster(this.POSTER_URL);
          this.player.autoplay(false);
          this.player.load();
        }
        else {
          this.player.poster("");
          this.player.play();
        }
      }
    }
    catch (err) {
    }
  }

  public async setMotionDetection(): Promise<void> {
    try {
      this.enableMotionDetection = !this.enableMotionDetection;
      await this.requestService.setMotionDetection(this.id.substring(9), this.enableMotionDetection);
      this.websocketService.setMotionDetection(this.deviceName, this.enableMotionDetection);
    }
    catch (err) {
      console.log(err);
    }
  }

  public async ngAfterViewInit() {
    try {
      this.url = await this.requestService.connectChannel(this.id.substring(9));
      this.player = videojs(this.id, {
        autoplay: true,
        fluid: false,
        sources: [
          {
            src: this.url,
            type: 'application/x-mpegURL'
          }
        ],
      });

    }
    catch (err) {
      console.log(err);
      await Swal.fire({
        title: 'server error',
        icon: 'error',
        text: "couldn't load camera, try again later",
        background: "#101416",
        color: "white",
      });
    }
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
    }
  }

  public openFullScreen(): void {
    //this.player.src(src)
    //this.player.selectSource(sources)
    //handleSrc_(source, isRetry)
    //updateSourceCaches_(srcObj)

    this.player.requestFullscreen();
  }

  public async setBlockStream(id: string, event: MouseEvent): Promise<void> {
    try {
      if (this.isBlocked == true) {
        await this.requestService.unblockChannel(id.substring(9));
        this.isBlocked = false;
        this.player.poster("");
        this.player.play();
      }
      else {
        await this.requestService.blockChannel(id.substring(9));
        this.isBlocked = true;
        this.player.src(this.url);
        this.player.autoplay(false);
        this.player.poster(this.POSTER_URL);
        this.player.load();
      }
      this.channelBlock.emit();
    }
    catch (err) {
      console.log(err);
    }
  }

  public async record() {
    try {
      this.recording = !this.recording;
      let res: string;
      if (this.recording) {
        res = await this.requestService.startChannelRecording(this.id.substring(9));
        if (res == "success") {
          this.recording = true;
        }
      }
      else {
        res = await this.requestService.stopChannelRecording(this.id.substring(9));
        if (res == "success") {
          this.recording = false;
        }
      }
      this.roomRecordCheck.emit(this.id);
    }
    catch (err) {
      await Swal.fire({
        title: 'server error',
        icon: 'error',
        text: "couldn't record camera, try again later",
        background: "#101416",
        color: "white",
      });
    }
  }
}
