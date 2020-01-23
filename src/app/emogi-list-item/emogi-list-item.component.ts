import { Component, OnInit, Input } from '@angular/core';
import { Emoji } from '../emoji';
import { DataService } from '../data.service';

@Component({
  selector: 'app-emogi-list-item',
  templateUrl: './emogi-list-item.component.html',
  styleUrls: ['./emogi-list-item.component.scss']
})
export class EmogiListItemComponent implements OnInit {

  @Input() pageType : string;
  @Input() emoji : Emoji;  
  private id : string;
  private url : string;
  private emojiFavorite : boolean = false;
  private showFavoriteBtn : boolean = false;
  private showDeleteBtn : boolean = false;
  private showReturnBtn : boolean = false;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
      this.initParams();
      this.assembleButtons();
      this.checkFavoriteEmoji();
  }

  private checkFavoriteEmoji(): void {
    if (this.pageType === 'all' && this.emoji.type === 'favorite') this.emojiFavorite = true;
  }

  /**
  * Определяем какие кнопки будут отображены
  */
  private assembleButtons() : void {
    if (this.pageType === "deleted") {
      this.assembleDeletePageBtn();
    } else if (this.pageType === "favorite") {
        this.assembleFavoritePageBtn();
    } else if (this.pageType === "all") {
        this.assembleAllPageBtn();
    }
  }

  private assembleDeletePageBtn() : void {
    this.showReturnBtn = true; 
  }

  private assembleFavoritePageBtn() : void {
    this.showDeleteBtn = true;
  }

  private assembleAllPageBtn() : void {
    this.showDeleteBtn = true;
    this.showFavoriteBtn = true;;
  }

  private initParams() {
    this.id = this.emoji.id;
    this.url = this.emoji.url;
  }

  clickReturnBtn() {
    this.dataService.removeDeletedEmoji(this.emoji.id);
  }

  clickDeleteBtn() {
    if (this.pageType == 'all') {
      this.dataService.addDeletedEmoji(this.emoji.id);
    } else if (this.pageType == 'favorite') {
      this.dataService.removeFavoriteEmoji(this.emoji.id);
    }
  }

  clickFavoriteBtn() {
    if (this.emoji.type === 'favorite') {
      this.dataService.removeFavoriteEmoji(this.emoji.id);
      this.emojiFavorite = false;
    } else if (this.emoji.type === 'all'){
      this.dataService.addFavoriteEmoji(this.emoji.id);
      this.emojiFavorite = true;
    }
  }

}
