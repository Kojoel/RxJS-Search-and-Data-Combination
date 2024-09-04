import { Component } from '@angular/core';
import { Observable, catchError, combineLatest, debounceTime, delay, distinctUntilChanged, filter, finalize, fromEvent, map, of, switchMap } from 'rxjs';
import { CombinedData } from '../../model/combined-data.model';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';


interface UserDetails {
  id: number;
  name: string;
  email: string;
}

interface UserPost {
  userId: number;
  title: string;
  content: string;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {

  searchControl = new FormControl('');
  results: string[] = [];
  errorMessage: string = '';
  isLoadingSearch: boolean = false;
  isLoadingCombinedData: boolean = false;
  combinedData$!: Observable<{ name: string; email: string; posts: UserPost[] }>;

  constructor(public api: ApiService) {}


  ngOnInit() {
    // Task 1: Implement Debounced Search with Error Handling and Loading State
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter((term: string | null): term is string => term !== null && term.length >= 3),
      switchMap(term => {
        this.isLoadingSearch = true;
        return this.api.search(term).pipe(
          catchError(error => {
            this.errorMessage = 'Search error occurred!';
            return of([]);
          }),
          finalize(() => this.isLoadingSearch = false)
        );
      })
    ).subscribe(results => {
      this.results = results;
      this.errorMessage = results.length === 0 ? this.errorMessage : '';
    });

    // Task 2: Combine Data from Multiple Endpoints with Error Handling and Loading State
    this.isLoadingCombinedData = true;
    this.combinedData$ = combineLatest([
      this.api.getUserDetails(),
      this.api.getUserPosts()
    ]).pipe(
      map(([userDetails, userPosts]) => ({
        ...userDetails,
        posts: userPosts.filter((post: UserPost) => post.userId === userDetails.id)
      })),
      catchError(error => {
        this.errorMessage = 'Data combination error occurred!';
        return of({ name: '', email: '', posts: [] });
      }),
      finalize(() => this.isLoadingCombinedData = false)
    );
  }
}
