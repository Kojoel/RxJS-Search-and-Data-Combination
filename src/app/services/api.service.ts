import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, delay, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  // Simulate an API call to search
  search(term: string): Observable<string[]> {
    if (Math.random() < 0.2) {
      return throwError(() => new Error('Search API error occurred!'));
    }
    const mockResults = ['Carrot', 'carrot', 'Broccoli', 'broccoli', 'Spinach', 'spinach', 'Potato', 'potato', 'Tomato', 'tomato', 'Cucumber', 'cucumber', 'Onion', 'onion']
      .filter(vegetables => vegetables.includes(term));
    return of(mockResults).pipe(
      delay(500),
      catchError(error => {
        console.error(error);
        return of([]);
      })
    );
  }

  // Simulate an API call to get user details  with error handling
  getUserDetails(): Observable<{ id: number; name: string; email: string }> {
    if (Math.random() < 0.2) {
      return throwError(() => new Error('User details API error occurred!'));
    }
    const userDetails = { id: 1, name: 'Manuel Pixel', email: 'manuel.pixel.com' };
    return of(userDetails).pipe(
      delay(700),
      catchError(error => {
        console.error(error);
        return of({ id: 0, name: '', email: '' });
      })
    );
  }

  // Simulate an API call to get user posts  with error handling
  getUserPosts(): Observable<{ userId: number; title: string; content: string }[]> {
    if (Math.random() < 0.2) {
      return throwError(() => new Error('User posts API error occurred!'));
    }
    const userPosts = [
      { userId: 1, title: "User's First Post", content: 'This is the content of the first post.' },
      { userId: 1, title: "Users' Second Post", content: 'This is the content of the second post.' }
    ];
    return of(userPosts).pipe(
      delay(800),
      catchError(error => {
        console.error(error);
        return of([]);
      })
    );
  }
}
