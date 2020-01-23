import { Component, OnInit, OnDestroy, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Emoji } from '../emoji';
import { Subscription, Observable } from 'rxjs';
import { DataService } from '../data.service';

     
@Component({
    selector: 'page-app',
    templateUrl: './page.component.html',
    styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit, OnDestroy, AfterViewChecked {

    private title : string;
    public emojies : Emoji[] = [];
    private pageType : string;
    private sub : Subscription;
    private filtredStream : Observable<Emoji[]>;
    preloader: boolean = true;

    constructor(
        private dataService: DataService, 
        private activateRoute: ActivatedRoute
    ) { }

    ngOnInit() {
      this.initPageType();
      this.subscribeStream();
    }

    private subscribeStream() {
      this.sub = this.filtredStream.subscribe(data => {
        if (data.length !== 0) this.setPreloader(true);
        this.emojies = data;
      }, (err) => {
        console.log(`Ошибка при чтении данных: ${err}`);
      }, () => {
        console.log('Чтение данных завершено.')
      });
    }

    private initPageType() {
        this.pageType = this.activateRoute.snapshot.url[0].path;
        if (this.pageType === "all") {
            this.title = "Все";
            this.setAllEmojiesFilter();
        } else if (this.pageType === "favorite"){
            this.title = "Любимые";
            this.setFavEmojiesFilter();
        } else if (this.pageType === "deleted"){
            this.title = "Удаленные";
            this.setDelEmojiesFilter();
        }
    }

    private setAllEmojiesFilter(): void {
        this.filtredStream = this.dataService.getAllEmojies();
    }

    private setDelEmojiesFilter(): void {
        this.filtredStream = this.dataService.getDelEmojies();
    }

    private setFavEmojiesFilter(): void {
        this.filtredStream = this.dataService.getFavEmojies();
    }

    ngOnDestroy() {
      this.sub.unsubscribe();
    }

    private setPreloader(status: boolean) {
      this.preloader = status;
    }

    ngAfterViewChecked(): void {
      if(this.preloader) setTimeout(() => this.setPreloader(false), 50);
    } 
}