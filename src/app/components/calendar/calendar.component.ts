import { Component,OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CalendarNotesService,CalendarNote } from '../../services/calendar-notes.service';
import { Input } from '@angular/core';

@Component({
   selector: 'app-calendar', 
  standalone: false,
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
  currentDate = new Date();
  monthYear = '';
  daysInMonth: { date: Date; dateStr: string }[] = [];
  emptyStart: any[] = [];
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  notesMap: { [key: string]: CalendarNote[] } = {};
  @Input() viewOnly = false;
  showModal = false;
  selectedDateStr = '';
  selectedDate = new Date();
  noteText = '';
  editingNote: CalendarNote | null = null;

  constructor(private notesService: CalendarNotesService) {}

  ngOnInit() {
    this.generateCalendar(this.currentDate);
    this.loadNotesForMonth(this.currentDate);
  }

  loadNotesForMonth(date: Date) {
    // Format month as yyyy-MM (e.g. "2025-07")
    const monthStr = date.toISOString().slice(0, 7);
    this.notesService.getNotes(monthStr).subscribe(notes => {
      this.notesMap = {};
      notes.forEach(note => {
        // Normalize date key to 'YYYY-MM-DD' format
        const noteDateKey = note.noteDate.slice(0, 10);
        if (!this.notesMap[noteDateKey]) {
          this.notesMap[noteDateKey] = [];
        }
        this.notesMap[noteDateKey].push(note);
      });
      console.log('Notes loaded:', this.notesMap);
    });
  }

  generateCalendar(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    this.monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysCount = lastDay.getDate();

    this.emptyStart = Array(firstDay.getDay()).fill(null);

    this.daysInMonth = [];
    for (let i = 1; i <= daysCount; i++) {
      const dt = new Date(year, month, i);
      const dateStr = this.formatDate(dt);
      this.daysInMonth.push({ date: dt, dateStr });
    }
  }

  formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  maybeOpenModal(date: Date, dateStr: string) {
    const hasNotes = this.notesMap[dateStr]?.length > 0;
    if (hasNotes || !this.viewOnly) {
      this.openNoteModal(date);
    }
  }

  openNoteModal(date: Date) {
    this.selectedDate = date;
    this.selectedDateStr = this.formatDate(date);
    this.editingNote = null;
    this.noteText = '';
    this.showModal = true;
  }

  editNote(note: CalendarNote) {
    if (this.viewOnly) return; // disallow editing in viewOnly mode
    this.editingNote = note;
    this.noteText = note.noteText;
  }

  saveNote() {
    if (!this.noteText.trim()) return;

    if (this.editingNote) {
      const updatedNote: CalendarNote = {
        ...this.editingNote,
        noteText: this.noteText,
      };
      this.notesService.updateNote(updatedNote).subscribe(() => {
        const arr = this.notesMap[updatedNote.noteDate.slice(0, 10)];
        const index = arr.findIndex(n => n.id === updatedNote.id);
        if (index > -1) arr[index] = updatedNote;
        this.closeModal();
      });
    } else {
      const newNote: CalendarNote = {
        noteDate: this.selectedDateStr,
        noteText: this.noteText,
      };
      this.notesService.addNote(newNote).subscribe(addedNote => {
        const key = addedNote.noteDate.slice(0, 10);
        if (!this.notesMap[key]) {
          this.notesMap[key] = [];
        }
        this.notesMap[key].push(addedNote);
        this.closeModal();
      });
    }
  }

  deleteNote(note: CalendarNote) {
    if (!confirm('Delete this note?')) return;
    if (!note.id) return;

    this.notesService.deleteNote(note.id).subscribe(() => {
      const key = note.noteDate.slice(0, 10);
      const arr = this.notesMap[key];
      this.notesMap[key] = arr.filter(n => n.id !== note.id);
      this.closeModal();
    });
  }

  closeModal() {
    this.showModal = false;
    this.editingNote = null;
    this.noteText = '';
  }

  goToPreviousMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendar(this.currentDate);
    this.loadNotesForMonth(this.currentDate);
  }

  goToNextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendar(this.currentDate);
    this.loadNotesForMonth(this.currentDate);
  }
}