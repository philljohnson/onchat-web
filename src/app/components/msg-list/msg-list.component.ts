import { Component, Input, OnInit } from '@angular/core';
import { ChatroomType, MessageType } from 'src/app/common/enum';
import { IEntity, Message } from 'src/app/models/onchat.model';
import { FeedbackService } from 'src/app/services/feedback.service';
import { GlobalData } from 'src/app/services/global-data.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { ImagePreviewerComponent } from '../modals/image-previewer/image-previewer.component';
import { BubbleToolbarComponent } from '../popovers/bubble-toolbar/bubble-toolbar.component';

@Component({
  selector: 'app-msg-list',
  templateUrl: './msg-list.component.html',
  styleUrls: ['./msg-list.component.scss'],
})
export class MsgListComponent implements OnInit {
  /** 消息类型枚举 */
  msgType: typeof MessageType = MessageType;
  /** 聊天室类型枚举 */
  chatroomTypes: typeof ChatroomType = ChatroomType;
  /** 消息记录 */
  @Input() data: Message[] = [];
  /** 消息记录是否到了末尾 */
  @Input() end: boolean;
  /** 聊天室类型 */
  @Input() chatroomType: ChatroomType;

  constructor(
    private overlayService: OverlayService,
    private feedbackService: FeedbackService,
    public globalData: GlobalData,
  ) { }

  ngOnInit() { }

  /**
   * 用于提升性能
   * 一般情况下，当数组内有变更时，
   * Angular将会对整个DOM树加以重新渲染。
   * 如果加上trackBy方法，Angular将会知道具体的变更元素，
   * 并针对性地对此特定元素进行DOM刷新，提升页面渲染性能。
   */
  trackByFn(index: number, item: IEntity): number {
    return item.id;
  }

  /**
   * 弹出BubbleToolbar气泡工具条
   * @param msgItem 气泡对应的Message
   * @param element
   * @param event
   */
  async presentBubbleToolbarPopover(msgItem: Message, element: Element, event: Event) {
    event.preventDefault();

    const popover = await this.overlayService.presentPopover({
      component: BubbleToolbarComponent,
      componentProps: {
        element,
        msgItem
      },
      cssClass: 'bubble-toolbar-popover',
      event,
      showBackdrop: false,
      keyboardClose: false,
      backdropDismiss: false
    });

    this.feedbackService.slightVibrate();
    // 延迟300ms后才打开点击背景关闭popover
    setTimeout(() => {
      popover.backdropDismiss = true;
    }, 300);
  }

  /**
   * 判断是否需要显示时间
   * @param time 当前时间
   * @param otherTime 上一个时间
   */
  canShowTime(time: number, otherTime: number): boolean {
    return (time - otherTime) > 60000; // 一分钟
  }

  previewImage(id: number) {
    const data = this.data.filter(o => o.type === MessageType.Image);
    const index = data.findIndex(o => o.id === id);

    this.overlayService.presentModal({
      component: ImagePreviewerComponent,
      componentProps: {
        data: data,
        index: index
      }
    });
  }

}
