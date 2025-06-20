import { Component, OnInit } from '@angular/core';
import { OrganismService, Organism } from '../../services/organism.service';
import { FungalOrganismService, FungalOrganism } from '../../services/fungalorganism.service';
import { Antimicrobial, AntimicrobialService } from '../../services/antimicrobial.service';
import { CongenitalInfectionOrganism, CongenitalInfectionOrganismService} from '../../services/congenitalinfectionorganism.service';
import { SonarFinding, SonarFindingService } from '../../services/sonarfinding.service';
import { Location } from '@angular/common';



@Component({
  selector: 'app-manage-form-template',
  templateUrl: './manage-form-template.component.html',
  styleUrls: ['./manage-form-template.component.scss'],
  standalone: false
})
export class ManageFormTemplateComponent implements OnInit {

  // Organism properties
  organisms: Organism[] = [];
  organismForm: Organism = { organismID: 0, organismName: '' };
  editingOrganism = false;
  organismSearchTerm: string = '';
  
  // Fungal Organism properties
  fungalOrganisms: FungalOrganism[] = [];
  fungalOrganismForm: FungalOrganism = { fungalOrganismID: 0, fungalOrganismName: '' };
  editingFungalOrganism = false;
  fungalOrganismSearchTerm: string = '';

  // Antimicrobial properties
  antimicrobials: Antimicrobial[] = [];
  antimicrobialForm: Antimicrobial = { antimicrobialID: 0, antimicrobialName: '' };
  editingAntimicrobial = false;
  antimicrobialSearchTerm: string = '';

  // Congenital Infection Organism properties
  congenitalInfectionOrganisms: CongenitalInfectionOrganism[] = [];
  congenitalInfectionOrganismForm: CongenitalInfectionOrganism = { congenitalInfectionOrganismID: 0, congenitalInfectionOrganismName: '' };
  editingCongenitalInfectionOrganism = false;
  congenitalInfectionOrganismSearchTerm: string = '';

  // Sonar Finding properties
  sonarFindings: SonarFinding[] = [];
  sonarFindingForm: SonarFinding = { sonarFindingID: 0, sonarFindingName: '' };
  editingSonarFinding = false;
  sonarFindingSearchTerm: string = '';
  
  // Tab control with proper typing
  activeTab: 'organism' | 'fungalOrganism' | 'antimicrobial' | 'congenitalInfectionOrganism' | 'sonarFinding' = 'organism';

  // Validation and UI state properties
  successMessage: string = '';
  errorMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private organismService: OrganismService,
    private fungalOrganismService: FungalOrganismService,
    private antimicrobialService: AntimicrobialService,
    private congenitalInfectionOrganismService: CongenitalInfectionOrganismService,
    private sonarFindingService: SonarFindingService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loadOrganisms();
    this.loadFungalOrganisms();
    this.loadAntimicrobials();
    this.loadCongenitalInfectionOrganisms();
    this.loadSonarFindings();
  }

  // Message handling methods
  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  showSuccessMessage(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
    // Auto-hide after 5 seconds
    setTimeout(() => this.clearMessages(), 5000);
  }

  showErrorMessage(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
    // Auto-hide after 8 seconds
    setTimeout(() => this.clearMessages(), 8000);
  }

  setActiveTab(tab: 'organism' | 'fungalOrganism' | 'antimicrobial' | 'congenitalInfectionOrganism' | 'sonarFinding') {
    this.activeTab = tab;
    this.clearMessages(); // Clear messages when switching tabs
  }

  // Organism methods
  loadOrganisms() {
    this.organismService.getAll().subscribe({
      next: (data) => {
        this.organisms = data;
      },
      error: (error) => {
        console.error('Error loading organisms:', error);
        this.showErrorMessage('Failed to load organisms. Please refresh the page.');
      }
    });
  }

  filteredOrganisms(): Organism[] {
    return this.organisms.filter(o =>
      o.organismName.toLowerCase().includes(this.organismSearchTerm.toLowerCase())
    );
  }

  async saveOrganism(): Promise<void> {
    if (!this.organismForm.organismName?.trim()) {
      this.showErrorMessage('Organism name is required.');
      return;
    }

    if (this.organismForm.organismName.trim().length < 2) {
      this.showErrorMessage('Organism name must be at least 2 characters long.');
      return;
    }

    if (this.organismForm.organismName.trim().length > 100) {
      this.showErrorMessage('Organism name cannot exceed 100 characters.');
      return;
    }

    this.isSubmitting = true;
    this.clearMessages();

    const trimmedForm = { ...this.organismForm, organismName: this.organismForm.organismName.trim() };

    try {
      if (this.editingOrganism) {
        await this.organismService.update(trimmedForm.organismID, trimmedForm).toPromise();
        this.showSuccessMessage('Organism updated successfully!');
      } else {
        await this.organismService.create(trimmedForm).toPromise();
        this.showSuccessMessage('Organism created successfully!');
      }
      this.resetOrganismForm();
      this.loadOrganisms();
    } catch (error) {
      console.error('Error saving organism:', error);
      const action = this.editingOrganism ? 'update' : 'create';
      this.showErrorMessage(`Failed to ${action} organism. Please try again.`);
    } finally {
      this.isSubmitting = false;
    }
  }

  editOrganism(organism: Organism) {
    this.organismForm = { ...organism };
    this.editingOrganism = true;
    this.clearMessages();
  }

  async deleteOrganism(id: number): Promise<void> {
    if (!confirm('Are you sure you want to delete this organism?')) {
      return;
    }

    this.isSubmitting = true;
    this.clearMessages();

    try {
      await this.organismService.delete(id).toPromise();
      this.showSuccessMessage('Organism deleted successfully!');
      this.loadOrganisms();
    } catch (error) {
      console.error('Error deleting organism:', error);
      this.showErrorMessage('Failed to delete organism. Please try again.');
    } finally {
      this.isSubmitting = false;
    }
  }

  resetOrganismForm() {
    this.organismForm = { organismID: 0, organismName: '' };
    this.editingOrganism = false;
  }

  // Fungal organism methods
  loadFungalOrganisms() {
    this.fungalOrganismService.getAll().subscribe({
      next: (data) => {
        this.fungalOrganisms = data;
      },
      error: (error) => {
        console.error('Error loading fungal organisms:', error);
        this.showErrorMessage('Failed to load fungal organisms. Please refresh the page.');
      }
    });
  }

  filteredFungalOrganisms(): FungalOrganism[] {
    return this.fungalOrganisms.filter(fo =>
      fo.fungalOrganismName.toLowerCase().includes(this.fungalOrganismSearchTerm.toLowerCase())
    );
  }

  async saveFungalOrganism(): Promise<void> {
    if (!this.fungalOrganismForm.fungalOrganismName?.trim()) {
      this.showErrorMessage('Fungal organism name is required.');
      return;
    }

    if (this.fungalOrganismForm.fungalOrganismName.trim().length < 2) {
      this.showErrorMessage('Fungal organism name must be at least 2 characters long.');
      return;
    }

    if (this.fungalOrganismForm.fungalOrganismName.trim().length > 100) {
      this.showErrorMessage('Fungal organism name cannot exceed 100 characters.');
      return;
    }

    this.isSubmitting = true;
    this.clearMessages();

    const trimmedForm = { ...this.fungalOrganismForm, fungalOrganismName: this.fungalOrganismForm.fungalOrganismName.trim() };

    try {
      if (this.editingFungalOrganism) {
        await this.fungalOrganismService.update(trimmedForm.fungalOrganismID, trimmedForm).toPromise();
        this.showSuccessMessage('Fungal organism updated successfully!');
      } else {
        await this.fungalOrganismService.create(trimmedForm).toPromise();
        this.showSuccessMessage('Fungal organism created successfully!');
      }
      this.resetFungalOrganismForm();
      this.loadFungalOrganisms();
    } catch (error) {
      console.error('Error saving fungal organism:', error);
      const action = this.editingFungalOrganism ? 'update' : 'create';
      this.showErrorMessage(`Failed to ${action} fungal organism. Please try again.`);
    } finally {
      this.isSubmitting = false;
    }
  }

  editFungalOrganism(fungalOrganism: FungalOrganism) {
    this.fungalOrganismForm = { ...fungalOrganism };
    this.editingFungalOrganism = true;
    this.clearMessages();
  }

  async deleteFungalOrganism(id: number): Promise<void> {
    if (!confirm('Are you sure you want to delete this fungal organism?')) {
      return;
    }

    this.isSubmitting = true;
    this.clearMessages();

    try {
      await this.fungalOrganismService.delete(id).toPromise();
      this.showSuccessMessage('Fungal organism deleted successfully!');
      this.loadFungalOrganisms();
    } catch (error) {
      console.error('Error deleting fungal organism:', error);
      this.showErrorMessage('Failed to delete fungal organism. Please try again.');
    } finally {
      this.isSubmitting = false;
    }
  }

  resetFungalOrganismForm() {
    this.fungalOrganismForm = { fungalOrganismID: 0, fungalOrganismName: '' };
    this.editingFungalOrganism = false;
  }

  // Antimicrobial methods
  loadAntimicrobials() {
    this.antimicrobialService.getAll().subscribe({
      next: (data) => {
        this.antimicrobials = data;
      },
      error: (error) => {
        console.error('Error loading antimicrobials:', error);
        this.showErrorMessage('Failed to load antimicrobials. Please refresh the page.');
      }
    });
  }

  filteredAntimicrobials(): Antimicrobial[] {
    return this.antimicrobials.filter(a =>
      a.antimicrobialName.toLowerCase().includes(this.antimicrobialSearchTerm.toLowerCase())
    );
  }

  async saveAntimicrobial(): Promise<void> {
    if (!this.antimicrobialForm.antimicrobialName?.trim()) {
      this.showErrorMessage('Antimicrobial name is required.');
      return;
    }

    if (this.antimicrobialForm.antimicrobialName.trim().length < 2) {
      this.showErrorMessage('Antimicrobial name must be at least 2 characters long.');
      return;
    }

    if (this.antimicrobialForm.antimicrobialName.trim().length > 100) {
      this.showErrorMessage('Antimicrobial name cannot exceed 100 characters.');
      return;
    }

    this.isSubmitting = true;
    this.clearMessages();

    const trimmedForm = { ...this.antimicrobialForm, antimicrobialName: this.antimicrobialForm.antimicrobialName.trim() };

    try {
      if (this.editingAntimicrobial) {
        await this.antimicrobialService.update(trimmedForm.antimicrobialID, trimmedForm).toPromise();
        this.showSuccessMessage('Antimicrobial updated successfully!');
      } else {
        await this.antimicrobialService.create(trimmedForm).toPromise();
        this.showSuccessMessage('Antimicrobial created successfully!');
      }
      this.resetAntimicrobialForm();
      this.loadAntimicrobials();
    } catch (error) {
      console.error('Error saving antimicrobial:', error);
      const action = this.editingAntimicrobial ? 'update' : 'create';
      this.showErrorMessage(`Failed to ${action} antimicrobial. Please try again.`);
    } finally {
      this.isSubmitting = false;
    }
  }

  editAntimicrobial(antimicrobial: Antimicrobial) {
    this.antimicrobialForm = { ...antimicrobial };
    this.editingAntimicrobial = true;
    this.clearMessages();
  }

  async deleteAntimicrobial(id: number): Promise<void> {
    if (!confirm('Are you sure you want to delete this antimicrobial?')) {
      return;
    }

    this.isSubmitting = true;
    this.clearMessages();

    try {
      await this.antimicrobialService.delete(id).toPromise();
      this.showSuccessMessage('Antimicrobial deleted successfully!');
      this.loadAntimicrobials();
    } catch (error) {
      console.error('Error deleting antimicrobial:', error);
      this.showErrorMessage('Failed to delete antimicrobial. Please try again.');
    } finally {
      this.isSubmitting = false;
    }
  }

  resetAntimicrobialForm() {
    this.antimicrobialForm = { antimicrobialID: 0, antimicrobialName: '' };
    this.editingAntimicrobial = false;
  }

  // Congenital Infection Organism methods
  loadCongenitalInfectionOrganisms() {
    this.congenitalInfectionOrganismService.getAll().subscribe({
      next: (data) => {
        this.congenitalInfectionOrganisms = data;
      },
      error: (error) => {
        console.error('Error loading congenital infection organisms:', error);
        this.showErrorMessage('Failed to load congenital infection organisms. Please refresh the page.');
      }
    });
  }

  filteredCongenitalInfectionOrganisms(): CongenitalInfectionOrganism[] {
    return this.congenitalInfectionOrganisms.filter(cio =>
      cio.congenitalInfectionOrganismName.toLowerCase().includes(this.congenitalInfectionOrganismSearchTerm.toLowerCase())
    );
  }

  async saveCongenitalInfectionOrganism(): Promise<void> {
    if (!this.congenitalInfectionOrganismForm.congenitalInfectionOrganismName?.trim()) {
      this.showErrorMessage('Congenital infection organism name is required.');
      return;
    }

    if (this.congenitalInfectionOrganismForm.congenitalInfectionOrganismName.trim().length < 2) {
      this.showErrorMessage('Congenital infection organism name must be at least 2 characters long.');
      return;
    }

    if (this.congenitalInfectionOrganismForm.congenitalInfectionOrganismName.trim().length > 100) {
      this.showErrorMessage('Congenital infection organism name cannot exceed 100 characters.');
      return;
    }

    this.isSubmitting = true;
    this.clearMessages();

    const trimmedForm = { ...this.congenitalInfectionOrganismForm, congenitalInfectionOrganismName: this.congenitalInfectionOrganismForm.congenitalInfectionOrganismName.trim() };

    try {
      if (this.editingCongenitalInfectionOrganism) {
        await this.congenitalInfectionOrganismService.update(trimmedForm.congenitalInfectionOrganismID, trimmedForm).toPromise();
        this.showSuccessMessage('Congenital infection organism updated successfully!');
      } else {
        await this.congenitalInfectionOrganismService.create(trimmedForm).toPromise();
        this.showSuccessMessage('Congenital infection organism created successfully!');
      }
      this.resetCongenitalInfectionOrganismForm();
      this.loadCongenitalInfectionOrganisms();
    } catch (error) {
      console.error('Error saving congenital infection organism:', error);
      const action = this.editingCongenitalInfectionOrganism ? 'update' : 'create';
      this.showErrorMessage(`Failed to ${action} congenital infection organism. Please try again.`);
    } finally {
      this.isSubmitting = false;
    }
  }

  editCongenitalInfectionOrganism(congenitalInfectionOrganism: CongenitalInfectionOrganism) {
    this.congenitalInfectionOrganismForm = { ...congenitalInfectionOrganism };
    this.editingCongenitalInfectionOrganism = true;
    this.clearMessages();
  }

  async deleteCongenitalInfectionOrganism(id: number): Promise<void> {
    if (!confirm('Are you sure you want to delete this congenital infection organism?')) {
      return;
    }

    this.isSubmitting = true;
    this.clearMessages();

    try {
      await this.congenitalInfectionOrganismService.delete(id).toPromise();
      this.showSuccessMessage('Congenital infection organism deleted successfully!');
      this.loadCongenitalInfectionOrganisms();
    } catch (error) {
      console.error('Error deleting congenital infection organism:', error);
      this.showErrorMessage('Failed to delete congenital infection organism. Please try again.');
    } finally {
      this.isSubmitting = false;
    }
  }

  resetCongenitalInfectionOrganismForm() {
    this.congenitalInfectionOrganismForm = { congenitalInfectionOrganismID: 0, congenitalInfectionOrganismName: '' };
    this.editingCongenitalInfectionOrganism = false;
  }

  // Sonar Finding methods
  loadSonarFindings() {
    this.sonarFindingService.getAll().subscribe({
      next: (data) => {
        this.sonarFindings = data;
      },
      error: (error) => {
        console.error('Error loading sonar findings:', error);
        this.showErrorMessage('Failed to load sonar findings. Please refresh the page.');
      }
    });
  }

  filteredSonarFindings(): SonarFinding[] {
    return this.sonarFindings.filter(sf =>
      sf.sonarFindingName.toLowerCase().includes(this.sonarFindingSearchTerm.toLowerCase())
    );
  }

  async saveSonarFinding(): Promise<void> {
    if (!this.sonarFindingForm.sonarFindingName?.trim()) {
      this.showErrorMessage('Sonar finding name is required.');
      return;
    }

    if (this.sonarFindingForm.sonarFindingName.trim().length < 2) {
      this.showErrorMessage('Sonar finding name must be at least 2 characters long.');
      return;
    }

    if (this.sonarFindingForm.sonarFindingName.trim().length > 100) {
      this.showErrorMessage('Sonar finding name cannot exceed 100 characters.');
      return;
    }

    this.isSubmitting = true;
    this.clearMessages();

    const trimmedForm = { ...this.sonarFindingForm, sonarFindingName: this.sonarFindingForm.sonarFindingName.trim() };

    try {
      if (this.editingSonarFinding) {
        await this.sonarFindingService.update(trimmedForm.sonarFindingID, trimmedForm).toPromise();
        this.showSuccessMessage('Sonar finding updated successfully!');
      } else {
        await this.sonarFindingService.create(trimmedForm).toPromise();
        this.showSuccessMessage('Sonar finding created successfully!');
      }
      this.resetSonarFindingForm();
      this.loadSonarFindings();
    } catch (error) {
      console.error('Error saving sonar finding:', error);
      const action = this.editingSonarFinding ? 'update' : 'create';
      this.showErrorMessage(`Failed to ${action} sonar finding. Please try again.`);
    } finally {
      this.isSubmitting = false;
    }
  }

  editSonarFinding(sonarFinding: SonarFinding) {
    this.sonarFindingForm = { ...sonarFinding };
    this.editingSonarFinding = true;
    this.clearMessages();
  }

  async deleteSonarFinding(id: number): Promise<void> {
    if (!confirm('Are you sure you want to delete this sonar finding?')) {
      return;
    }

    this.isSubmitting = true;
    this.clearMessages();

    try {
      await this.sonarFindingService.delete(id).toPromise();
      this.showSuccessMessage('Sonar finding deleted successfully!');
      this.loadSonarFindings();
    } catch (error) {
      console.error('Error deleting sonar finding:', error);
      this.showErrorMessage('Failed to delete sonar finding. Please try again.');
    } finally {
      this.isSubmitting = false;
    }
  }

  resetSonarFindingForm() {
    this.sonarFindingForm = { sonarFindingID: 0, sonarFindingName: '' };
    this.editingSonarFinding = false;
  }

  goBack() {
    this.location.back();
  }
}
 