import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Emoji } from './emoji';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { map } from 'rxjs/operators';
  
@Injectable({
    providedIn: 'root'
  })
export class DataService{

  private _emojies: BehaviorSubject<Emoji[]> = new BehaviorSubject<Emoji[]>([]);
  public emojies: Observable<Emoji[]> = this._emojies.asObservable();

  private storage :  Emoji[];
  private localKey: string = "emojies";
  private dataUrl : string = 'https://api.github.com/emojis';

  constructor(private http: HttpClient){ }
     
  /*
  * Загружаем данные с https://api.github.com/emojis 
  * и добавляем новые эиоджв или удаляем старые
  */
  public initData() : void {
    this.getDataByAPI()
    .subscribe((emojies : Emoji[]) => {
      console.log('Загрузка данных...');
      this.getDataFromLoacalStorage();
      if (this.storage) {                   
        this.updateInitData(emojies);
        if (emojies.length > 0) this.addEmojies(emojies);
      } else {
        this.storage = emojies;
      }
    }, (err) => {
      console.log(`Ошибка при загрузке данных: ${err}`);
    }, () => {
      this.setDataToLoacalStorage(this.storage);
      this.pushDataToStream(this.storage);
      console.log('Загрузка данных завершена.');
    });  
  }

    private getDataByAPI() : Observable<Emoji[]> {
        return this.http.get(this.dataUrl)
        .pipe(map((data : Object) => { 
                return this.convertDataToEmojies(data); 
            })
        );
    }

    private convertDataToEmojies(data : Object) : Emoji[] {
        let emojies : Emoji[] = [];
        for (let key in data) {
            let emoji : Emoji = new Emoji();
            emoji.id = key;
            emoji.url = data[key];
            emoji.type = "all";
            emojies.push(emoji);
        }
        return emojies;
    }

    private pushDataToStream(data : Emoji[]) : void {
        this._emojies.next(data); 
    }

    /*
    * Сравниваем данные
    * и добавляем новые 
    * эмоджи или удаляем старые
    * или удаляем старые
    */
    private updateInitData(emojies : Emoji[]) : void {
        this.storage.forEach(item => {
            let equal = false;
            emojies.forEach(emoji => {
                if (emoji.id === item.id) {
                    this.deleteEmojiArrayItem(emoji, emojies);
                    equal = true;
                    if (!(emoji.url === item.url)) this.changeEmojiArrayItem(item, this.storage, emoji);
                }
            });
            if (!equal) this.deleteEmojiArrayItem(item, this.storage);
        });
    }

    private addEmojies(newEmojies : Emoji[]) : void {
        newEmojies.forEach(emoji => this.storage.push(emoji));
    }

    private deleteEmojiArrayItem(item : Emoji, emojiArray : Emoji[]) : void {
        emojiArray.splice(emojiArray.indexOf(item), 1);
    }

    private changeEmojiArrayItem(item : Emoji, emojiArray : Emoji[], newItem : Emoji) : void {
        emojiArray.splice(emojiArray.indexOf(item), 1, newItem);
    }

    private getDataFromLoacalStorage() : void {
        this.storage = JSON.parse(localStorage.getItem(this.localKey));
    }

    private setDataToLoacalStorage(newEmojies : Emoji[]) : void {
        localStorage.setItem(this.localKey,JSON.stringify(newEmojies));
    }

    private updateData(newEmojies: Emoji[]): void {
        this.storage = newEmojies;
        this.setDataToLoacalStorage(this.storage);
        this.pushDataToStream(this.storage);
    }

    private changeItem(emojiID: string, newType: string): Emoji[] {
        let newEmojies : Emoji[] = this.storage;
        let changedItem: Emoji = newEmojies.find((emoji: Emoji) => emoji.id === emojiID);
        changedItem.type = newType;
        return newEmojies;
    }

    /**
     * Метод фильтра для получения данных из списка со всеми эмоджи 
     */
    public getAllEmojies() : Observable<Emoji[]> {
        return this.emojies.pipe(map(emojies => {
            return emojies.filter(emoji => {
                return emoji.type === 'all' || emoji.type === 'favorite'
            })
        }));
    }

    /**
     * Метод фильтра для получения данных из списка с любимыми эмоджи 
     */
    public getFavEmojies() : Observable<Emoji[]> {
        return this.emojies.pipe(map(emojies => {
            return emojies.filter(emoji => {
                return emoji.type === 'favorite'
            })
        }));
    }

    /**
     * Метод фильтра для получения данных из списка с удаленными эмоджи 
     */
    public getDelEmojies() : Observable<Emoji[]> {
        return this.emojies.pipe(map(emojies => {
            return emojies.filter(emoji => {
                return emoji.type === 'deleted'
            })
        }));
    }

    public searchEmoji(searchText : string) : void{
        let newEmojies : Emoji[];
        newEmojies = this.storage.filter((item : Emoji) => {
            return item.id.startsWith(searchText);
        });
        this.pushDataToStream(newEmojies);
    }

    public addFavoriteEmoji(emojiID : string) {
        let newType = 'favorite';
        let newEmojies = this.changeItem(emojiID, newType);
        this.updateData(newEmojies);
    }

    public removeFavoriteEmoji(emojiID : string) {
        let newType = 'all';
        let newEmojies = this.changeItem(emojiID, newType);
        this.updateData(newEmojies);
    }

    public addDeletedEmoji(emojiID : string) {
        let newType = 'deleted';
        let newEmojies = this.changeItem(emojiID, newType);
        this.updateData(newEmojies);
    }

    public removeDeletedEmoji(emojiID : string) {
        let newType = 'all';
        let newEmojies = this.changeItem(emojiID, newType);
        this.updateData(newEmojies);
    }
}