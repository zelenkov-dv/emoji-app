import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit{
  
  ngOnInit(): void {
  }

  constructor(
    private dataService: DataService
  ) { }

  search(searchText : string) : void {
    this.dataService.searchEmoji(searchText);
  }

}
