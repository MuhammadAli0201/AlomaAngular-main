import { Component, OnInit } from '@angular/core';
import { HelpResourceService,Faq } from '../../services/help-resource.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-help-resource',
  standalone: false,
  templateUrl: './help-resource.component.html',
  styleUrl: './help-resource.component.scss'
})
export class HelpResourceComponent implements OnInit {
  faqs: Faq[] = [];
  faqForm: Faq = { id: 0, question: '', answer: '' };
  editingId: number | null = null;

  constructor(private helpService: HelpResourceService,private location: Location) {}

  ngOnInit() {
    this.loadFaqs();
  }

  loadFaqs() {
    this.helpService.getFaqs().subscribe(data => this.faqs = data);
  }
  faqSearch: string = '';

filteredFaqs() {
  if (!this.faqSearch?.trim()) {
    return this.faqs;
  }

  const query = this.faqSearch.toLowerCase();
  return this.faqs.filter(faq =>
    faq.question.toLowerCase().includes(query) ||
    faq.answer.toLowerCase().includes(query)
  );
}

  saveFaq() {
    if (this.editingId) {
      this.helpService.updateFaq(this.editingId, this.faqForm).subscribe(() => {
        this.loadFaqs();
        this.cancelEdit();
      });
    } else {
      this.helpService.createFaq(this.faqForm).subscribe(() => {
        this.loadFaqs();
        this.resetForm();
      });
    }
  }

  editFaq(faq: Faq) {
    this.faqForm = { ...faq };
    this.editingId = faq.id;
  }

  deleteFaq(id: number) {
    this.helpService.deleteFaq(id).subscribe(() => this.loadFaqs());
  }

  cancelEdit() {
    this.editingId = null;
    this.resetForm();
  }

  resetForm() {
    this.faqForm = { id: 0, question: '', answer: '' };
  }

  goBack() {
  this.location.back();
}
}
