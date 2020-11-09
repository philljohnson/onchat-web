import { Component, Input, OnInit } from '@angular/core';
import { MessageType } from 'src/app/common/enum';
import { Message } from 'src/app/models/onchat.model';
import { GlobalDataService } from 'src/app/services/global-data.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { SocketService } from 'src/app/services/socket.service';
import { SysUtil } from 'src/app/utils/sys.util';

@Component({
  selector: 'app-bubble-toolbar',
  templateUrl: './bubble-toolbar.component.html',
  styleUrls: ['./bubble-toolbar.component.scss'],
})
export class BubbleToolbarComponent implements OnInit {
  /** 气泡节点 */
  @Input() element: HTMLElement;
  /** 消息体 */
  @Input() msgItem: Message;
  /** 当前时间戳 */
  now: number = Date.now();
  /** 消息类型枚举 */
  msgType: typeof MessageType = MessageType;

  constructor(
    public globalDataService: GlobalDataService,
    private overlayService: OverlayService,
    private socketService: SocketService,
  ) { }

  ngOnInit() { }

  /**
   * 复制文本消息
   */
  copyText() {
    SysUtil.copyText(this.element);
    this.dismiss();
  }

  /**
   * 撤回消息
   */
  revokeMsg() {
    this.socketService.revokeMsg(this.globalDataService.chatroomId, this.msgItem.id);
    this.dismiss();
  }

  /**
   * 关闭气泡消息工具条
   */
  dismiss() {
    this.overlayService.bubbleToolbarPopover && this.overlayService.bubbleToolbarPopover.dismiss().then(() => {
      this.overlayService.bubbleToolbarPopover = null;
    });
  }

}
