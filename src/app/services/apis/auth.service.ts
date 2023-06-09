import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Result, User } from 'src/app/models/onchat.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  /**
   * 续签访问令牌
   * @param token 续签令牌
   */
  refresh(token: string) {
    return this.http.get<Result<string>>(environment.authCtx + '/refresh', { params: { token } });
  }

  /**
   * 获取令牌的用户信息
   */
  info() {
    return this.http.get<Result<User>>(environment.authCtx + '/info');
  }

  /**
   * 登出
   */
  logout(): Observable<null> {
    return this.http.get<null>(environment.authCtx + '/logout');
  }
}
