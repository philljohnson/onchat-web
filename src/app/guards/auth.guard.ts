import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Result, User } from '../models/onchat.model';
import { GlobalDataService } from '../services/global-data.service';
import { OnChatService } from '../services/onchat.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private onChatService: OnChatService,
    private globalDataService: GlobalDataService,
    private router: Router
  ) { }

  private handle(): boolean | Observable<boolean> {
    if (this.globalDataService.user) { return true; }

    return new Observable(observer => {
      this.onChatService.checkLogin().subscribe((result: Result<boolean | User>) => {
        if (result.data) {
          this.globalDataService.user = result.data as User;
        } else {
          this.router.navigate(['/user/login']); // 返回登录页面
        }

        observer.next(!!result.data);
        observer.complete();
      });
    });
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean | Promise<boolean> | Observable<boolean> {
    return this.handle();
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.handle();
  }

}
