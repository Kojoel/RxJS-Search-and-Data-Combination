import { Component } from '@angular/core';
import { catchError, combineLatest, debounceTime, delay, filter, fromEvent, of, switchMap } from 'rxjs';
import { CombinedData } from '../../model/combined-data.model';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  searchResults: any[] = [];
  combinedData: CombinedData | null = null;
  searchError: string | null = null;
  dataError: string | null = null;
  loadingSearch = false;
  loadingData = false;

  constructor(public api: ApiService) {}

  ngOnInit() {
    this.setupSearchObservable();
    this.setupCombinedDataObservable();
  }

  // ngAfterViewInit() {
  //   const searchInput = document.getElementById('searchInput') as HTMLInputElement;
  // }

  setupSearchObservable() {
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    const search$ = fromEvent(searchInput, 'input').pipe(
      debounceTime(300),
      filter((event: any) => event.target.value.length >= 3),
      switchMap((event: any) => {
        this.loadingSearch = true;
        return this.adviceApiCall();
      }),
      catchError(error => {
        this.searchError = 'Error fetching search results';
        this.loadingSearch = false;
        return of([]); // return empty array in case of error
      })
    );

    search$.subscribe(results => {
      this.searchResults = results;
      this.loadingSearch = false;
    });
  }

  adviceApiCall() {
    return of([this.api.showAdvice()]).pipe(
      delay(1000) // simulate network delay
    );
  }

  setupCombinedDataObservable() {
    this.loadingData = true;
    
    const userDetails$ = of([1,3,4,5]).pipe(delay(1000));
    const userPosts$ = of(['this', 'is', 'it']).pipe(delay(1500));

    const combinedData$ = combineLatest([userDetails$, userPosts$]).pipe(
      catchError(error => {
        this.dataError = 'Error fetching combined data';
        this.loadingData = false;
        return of([null, null]); // return null in case of error
      })
    );

    combinedData$.subscribe(([userDetails, userPosts]) => {
      this.combinedData = { userDetails, userPosts };
      this.loadingData = false;
    });
  }
}
