import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface CalendarNote {
  id?: number;
  noteDate: string;  // ISO string date
  noteText: string;
}
@Injectable({
  providedIn: 'root'
})
export class CalendarNotesService {
  private apiUrl = 'https://localhost:7008/api/CalendarNotes'; // Change port to your API port

  constructor(private http: HttpClient) { }

  getNotes(month: string): Observable<CalendarNote[]> {
    return this.http.get<CalendarNote[]>(`${this.apiUrl}?month=${month}`);
  }

  addNote(note: CalendarNote): Observable<CalendarNote> {
    return this.http.post<CalendarNote>(this.apiUrl, note);
  }

  updateNote(note: CalendarNote): Observable<CalendarNote> {
    return this.http.put<CalendarNote>(`${this.apiUrl}/${note.id}`, note);
  }

  deleteNote(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
