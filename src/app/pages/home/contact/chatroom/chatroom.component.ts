import { Component, Inject } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { WINDOW } from 'src/app/common/tokens';
import { ChatSession, Result } from 'src/app/models/onchat.model';
import { UserService } from 'src/app/services/apis/user.service';
import { GlobalData } from 'src/app/services/global-data.service';
import { CssUtils } from 'src/app/utilities/css.utils';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss'],
})
export class ChatroomComponent implements ViewWillEnter {
  /** 虚拟列表项目高度 */
  itemHeight: number = CssUtils.rem2px(4.425);

  minBufferPx: number = this.window.innerHeight * 1.5;
  maxBufferPx: number = this.window.innerHeight * 2;

  constructor(
    private userService: UserService,
    public globalData: GlobalData,
    @Inject(WINDOW) private window: Window,
  ) { }

  ionViewWillEnter() {
    // 如果为空，就加载
    this.globalData.groupChatrooms || this.userService.getGroupChatrooms().subscribe(({ data }: Result<ChatSession[]>) => {
      this.globalData.groupChatrooms = data;
    });
  }

}
