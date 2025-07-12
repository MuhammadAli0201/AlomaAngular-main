import { Component, OnInit } from '@angular/core';
import { OrganismService, Organism } from '../../services/organism.service';
import { FungalOrganismService, FungalOrganism } from '../../services/fungalorganism.service';
import { Antimicrobial, AntimicrobialService } from '../../services/antimicrobial.service';
import { CongenitalInfectionOrganism, CongenitalInfectionOrganismService} from '../../services/congenitalinfectionorganism.service';
import { SonarFinding, SonarFindingService } from '../../services/sonarfinding.service';
import { Location } from '@angular/common';
import { ProvinceService } from '../../services/province.service';
import { CityService } from '../../services/city.service';
import { SuburbService } from '../../services/suburb.service';
import { HospitalService } from '../../services/hospital.service';
import { Province } from '../../models/province';
import { City } from '../../models/city';
import { Suburb } from '../../models/suburb';
import { Hospital } from '../../models/hospital';
import { Unit } from '../../models/unit';
import { UnitService } from '../../services/unit.service';



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

  // Province properties
  provnices: Province[] = [];
  provniceForm: Province = { provinceId: 0, name: '', cities: [] };
  editingProvince = false;
  provinceSearchTerm: string = '';

  // City properties
  cities: City[] = [];
  cityForm: City = { cityId: 0, name: '', provinceId: 0, suburbs: [] };
  editingCity = false;
  citySearchTerm: string = '';

  // Suburb properties
  suburbs: Suburb[] = [];
  suburbForm: Suburb = { suburbId: 0, name: '', cityId: 0, provinceId: 0, hospitals: [] };
  editingSuburb = false;
  suburbSearchTerm: string = '';

  hospitals: Hospital[] = [];
  hospitalForm: Hospital = { hospitalId: 0, name: '', address: '', provinceId: 0, cityId: 0, suburbId: 0 };
  editingHospital = false;
  hospitalSearchTerm: string = '';

  // Unit properties
  units: Unit[] = [];
  unitForm: Unit = { unitId: 0, name: '', reason: '' };
  editingUnit = false;
  unitSearchTerm: string = '';
  
  // Tab control with proper typing
  activeTab: 'organism' | 'fungalOrganism' | 'antimicrobial' | 'congenitalInfectionOrganism' | 'sonarFinding' | 'province' | 'city' | 'suburb' | 'hospital' | 'unit' = 'organism';

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
    private provinceService: ProvinceService,
    private cityService: CityService,
    private suburbService: SuburbService,
    private hospitalService: HospitalService,
    private unitService: UnitService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loadOrganisms();
    this.loadFungalOrganisms();
    this.loadAntimicrobials();
    this.loadCongenitalInfectionOrganisms();
    this.loadSonarFindings();
    this.loadProvinces();
    this.loadCities();
    this.loadSuburbs();
    this.loadHospitals();
    this.loadUnits();
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

  setActiveTab(tab: 'organism' | 'fungalOrganism' | 'antimicrobial' | 'congenitalInfectionOrganism' | 'sonarFinding' | 'province' | 'city' | 'suburb' | 'hospital' | 'unit') {
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

  loadProvinces() {
    this.provinceService.getAll().subscribe({
      next: (data) => {
        this.provnices = data;
      },
      error: (error) => {
        console.error('Error loading provinces:', error);
        this.showErrorMessage('Failed to load provinces. Please refresh the page.');
      }
    });
  }

  filteredProvinces(): Province[] {
    return this.provnices.filter(p =>
      p.name.toLowerCase().includes(this.sonarFindingSearchTerm.toLowerCase())
    );
  }

  async saveProvince(): Promise<void> {
    if (!this.provniceForm.name?.trim()) {
      this.showErrorMessage('Povince name is required.');
      return;
    }

    if (this.provniceForm.name.trim().length < 2) {
      this.showErrorMessage('Province name must be at least 2 characters long.');
      return;
    }

    if (this.provniceForm.name.trim().length > 100) {
      this.showErrorMessage('Province name cannot exceed 100 characters.');
      return;
    }

    this.isSubmitting = true;
    this.clearMessages();

    const trimmedForm = { ...this.provniceForm, name: this.provniceForm.name.trim() };

    try {
      if (this.editingProvince) {
        await this.provinceService.update(trimmedForm.provinceId, trimmedForm).toPromise();
        this.showSuccessMessage('Province updated successfully!');
      } else {
        await this.provinceService.create(trimmedForm).toPromise();
        this.showSuccessMessage('Province created successfully!');
      }
      this.resetProvinceForm();
      this.loadProvinces();
    } catch (error) {
      console.error('Error saving provinces:', error);
      const action = this.editingProvince ? 'update' : 'create';
      this.showErrorMessage(`Failed to ${action} province. Please try again.`);
    } finally {
      this.isSubmitting = false;
    }
  }

  editProvince(province: Province) {
    this.provniceForm = { ...province };
    this.editingProvince = true;
    this.clearMessages();
  }

  async deleteProvince(id: number): Promise<void> {
    if (!confirm('Are you sure you want to delete this province?')) {
      return;
    }

    this.isSubmitting = true;
    this.clearMessages();

    try {
      await this.provinceService.delete(id).toPromise();
      this.showSuccessMessage('Province deleted successfully!');
      this.loadProvinces();
    } catch (error) {
      console.error('Error deleting province:', error);
      this.showErrorMessage('Failed to delete province. Please try again.');
    } finally {
      this.isSubmitting = false;
    }
  }

  resetProvinceForm() {
    this.provniceForm = { provinceId: 0, name: '', cities: [] };
    this.editingProvince = false;
  }

  // City methods
  loadCities() {
    this.cityService.getAll().subscribe({
      next: (data) => {
        this.cities = data;
      },
      error: (error) => {
        console.error('Error loading cities:', error);
        this.showErrorMessage('Failed to load cities. Please refresh the page.');
      }
    });
  }

  filteredCities(): City[] {
    return this.cities.filter(c =>
      c.name.toLowerCase().includes(this.citySearchTerm.toLowerCase())
    );
  }

  async saveCity(): Promise<void> {
    if (!this.cityForm.name?.trim()) {
      this.showErrorMessage('City name is required.');
      return;
    }

    if (this.cityForm.name.trim().length < 2) {
      this.showErrorMessage('City name must be at least 2 characters long.');
      return;
    }

    if (this.cityForm.name.trim().length > 100) {
      this.showErrorMessage('City name cannot exceed 100 characters.');
      return;
    }
    
    if (!this.cityForm.provinceId || this.cityForm.provinceId <= 0) {
      this.showErrorMessage('Province is required for the city.');
      return;
    }

    this.isSubmitting = true;
    this.clearMessages();

    const trimmedForm = { ...this.cityForm, name: this.cityForm.name.trim(), suburbs: [] };

    try {
      if (this.editingCity) {
        await this.cityService.update(trimmedForm.cityId, trimmedForm).toPromise();
        this.showSuccessMessage('City updated successfully!');
      } else {
        await this.cityService.create(trimmedForm).toPromise();
        this.showSuccessMessage('City created successfully!');
      }
      this.resetCityForm();
      this.loadCities();
    } catch (error) {
      console.error('Error saving city:', error);
      const action = this.editingCity ? 'update' : 'create';
      this.showErrorMessage(`Failed to ${action} city. Please try again.`);
    } finally {
      this.isSubmitting = false;
    }
  }

  editCity(city: City) {
    this.cityForm = { ...city, suburbs: [] };
    this.editingCity = true;
    this.clearMessages();
  }

  async deleteCity(id: number): Promise<void> {
    if (!confirm('Are you sure you want to delete this city?')) {
      return;
    }

    this.isSubmitting = true;
    this.clearMessages();

    try {
      await this.cityService.delete(id).toPromise();
      this.showSuccessMessage('City deleted successfully!');
      this.loadCities();
    } catch (error) {
      console.error('Error deleting city:', error);
      this.showErrorMessage('Failed to delete city. Please try again.');
    } finally {
      this.isSubmitting = false;
    }
  }

  resetCityForm() {
    this.cityForm = { cityId: 0, name: '', provinceId: 0, suburbs: [] };
    this.editingCity = false;
  }

  // Suburb methods
  loadSuburbs() {
    this.suburbService.getAll().subscribe({
      next: (data) => {
        this.suburbs = data;
      },
      error: (error) => {
        console.error('Error loading suburbs:', error);
        this.showErrorMessage('Failed to load suburbs. Please refresh the page.');
      }
    });
  }

  filteredSuburbs(): Suburb[] {
    return this.suburbs.filter(s =>
      s.name.toLowerCase().includes(this.suburbSearchTerm.toLowerCase())
    );
  }

  async saveSuburb(): Promise<void> {
    if (!this.suburbForm.name?.trim()) {
      this.showErrorMessage('Suburb name is required.');
      return;
    }

    if (this.suburbForm.name.trim().length < 2) {
      this.showErrorMessage('Suburb name must be at least 2 characters long.');
      return;
    }

    if (this.suburbForm.name.trim().length > 100) {
      this.showErrorMessage('Suburb name cannot exceed 100 characters.');
      return;
    }

    if (!this.suburbForm.cityId || this.suburbForm.cityId <= 0) {
      this.showErrorMessage('City is required for the suburb.');
      return;
    }

    this.isSubmitting = true;
    this.clearMessages();

    const trimmedForm = { ...this.suburbForm, name: this.suburbForm.name.trim(), hospitals: [] };

    try {
      if (this.editingSuburb) {
        await this.suburbService.update(trimmedForm.suburbId, trimmedForm).toPromise();
        this.showSuccessMessage('Suburb updated successfully!');
      } else {
        await this.suburbService.create(trimmedForm).toPromise();
        this.showSuccessMessage('Suburb created successfully!');
      }
      this.resetSuburbForm();
      this.loadSuburbs();
    } catch (error) {
      console.error('Error saving suburb:', error);
      const action = this.editingSuburb ? 'update' : 'create';
      this.showErrorMessage(`Failed to ${action} suburb. Please try again.`);
    } finally {
      this.isSubmitting = false;
    }
  }

  editSuburb(suburb: Suburb) {
    this.suburbForm = { ...suburb, hospitals: [] };
    this.editingSuburb = true;
    this.clearMessages();
  }

  async deleteSuburb(id: number): Promise<void> {
    if (!confirm('Are you sure you want to delete this suburb?')) {
      return;
    }

    this.isSubmitting = true;
    this.clearMessages();

    try {
      await this.suburbService.delete(id).toPromise();
      this.showSuccessMessage('Suburb deleted successfully!');
      this.loadSuburbs();
    } catch (error) {
      console.error('Error deleting suburb:', error);
      this.showErrorMessage('Failed to delete suburb. Please try again.');
    } finally {
      this.isSubmitting = false;
    }
  }

  resetSuburbForm() {
    this.suburbForm = { suburbId: 0, name: '', cityId: 0, provinceId: 0, hospitals: [] };
    this.editingSuburb = false;
  }

  loadHospitals() {
    this.hospitalService.getAll().subscribe({
      next: (data) => {
        this.hospitals = data;
      },
      error: (error) => {
        console.error('Error loading hospitals:', error);
        this.showErrorMessage('Failed to load hospitals. Please refresh the page.');
      }
    });
  }

  filteredHospitals(): Hospital[] {
    return this.hospitals.filter(h =>
      h.name.toLowerCase().includes(this.hospitalSearchTerm.toLowerCase())
    );
  }

  async saveHospital(): Promise<void> {
    if (!this.hospitalForm.name?.trim()) {
      this.showErrorMessage('Hospital name is required.');
      return;
    }
    if (this.hospitalForm.name.trim().length < 2) {
      this.showErrorMessage('Hospital name must be at least 2 characters long.');
      return;
    }
    if (this.hospitalForm.name.trim().length > 100) {
      this.showErrorMessage('Hospital name cannot exceed 100 characters.');
      return;
    }
    if (!this.hospitalForm.address?.trim()) {
      this.showErrorMessage('Hospital address is required.');
      return;
    }
    if (!this.hospitalForm.provinceId || this.hospitalForm.provinceId <= 0) {
      this.showErrorMessage('Province is required for the hospital.');
      return;
    }
    if (!this.hospitalForm.cityId || this.hospitalForm.cityId <= 0) {
      this.showErrorMessage('City is required for the hospital.');
      return;
    }
    if (!this.hospitalForm.suburbId || this.hospitalForm.suburbId <= 0) {
      this.showErrorMessage('Suburb is required for the hospital.');
      return;
    }

    this.isSubmitting = true;
    this.clearMessages();

    const trimmedForm = {
      name: this.hospitalForm.name.trim(),
      address: this.hospitalForm.address.trim(),
      provinceId: this.hospitalForm.provinceId,
      cityId: this.hospitalForm.cityId,
      suburbId: this.hospitalForm.suburbId,
      hospitalId: this.hospitalForm.hospitalId || 0
    };

    try {
      if (this.editingHospital) {
        await this.hospitalService.update(trimmedForm.hospitalId, trimmedForm).toPromise();
        this.showSuccessMessage('Hospital updated successfully!');
      } else {
        await this.hospitalService.create(trimmedForm).toPromise();
        this.showSuccessMessage('Hospital created successfully!');
      }
      this.resetHospitalForm();
      this.loadHospitals();
    } catch (error) {
      console.error('Error saving hospital:', error);
      const action = this.editingHospital ? 'update' : 'create';
      this.showErrorMessage(`Failed to ${action} hospital. Please try again.`);
    } finally {
      this.isSubmitting = false;
    }
  }

  editHospital(hospital: Hospital) {
    this.hospitalForm = { ...hospital };
    this.editingHospital = true;
    this.clearMessages();
  }

  async deleteHospital(id: number): Promise<void> {
    if (!confirm('Are you sure you want to delete this hospital?')) {
      return;
    }

    this.isSubmitting = true;
    this.clearMessages();

    try {
      await this.hospitalService.delete(id).toPromise();
      this.showSuccessMessage('Hospital deleted successfully!');
      this.loadHospitals();
    } catch (error) {
      console.error('Error deleting hospital:', error);
      this.showErrorMessage('Failed to delete hospital. Please try again.');
    } finally {
      this.isSubmitting = false;
    }
  }

  resetHospitalForm() {
    this.hospitalForm = { hospitalId: 0, name: '', address: '', provinceId: 0, cityId: 0, suburbId: 0 };
    this.editingHospital = false;
  }

  // Unit methods
  loadUnits() {
    this.unitService.getAll().subscribe({
      next: (data) => {
        this.units = data;
      },
      error: (error) => {
        console.error('Error loading units:', error);
        this.showErrorMessage('Failed to load units. Please refresh the page.');
      }
    });
  }

  filteredUnits(): Unit[] {
    return this.units.filter(u =>
      u.name.toLowerCase().includes(this.unitSearchTerm.toLowerCase())
    );
  }

  async saveUnit(): Promise<void> {
    if (!this.unitForm.name?.trim()) {
      this.showErrorMessage('Unit name is required.');
      return;
    }
    if (this.unitForm.name.trim().length < 2) {
      this.showErrorMessage('Unit name must be at least 2 characters long.');
      return;
    }
    if (this.unitForm.name.trim().length > 100) {
      this.showErrorMessage('Unit name cannot exceed 100 characters.');
      return;
    }
    if (!this.unitForm.reason?.trim()) {
      this.showErrorMessage('Unit reason is required.');
      return;
    }

    this.isSubmitting = true;
    this.clearMessages();

    const trimmedForm = {
      ...this.unitForm,
      name: this.unitForm.name.trim(),
      reason: this.unitForm.reason.trim()
    };

    try {
      if (this.editingUnit) {
        await this.unitService.update(trimmedForm.unitId, trimmedForm).toPromise();
        this.showSuccessMessage('Unit updated successfully!');
      } else {
        await this.unitService.create(trimmedForm).toPromise();
        this.showSuccessMessage('Unit created successfully!');
      }
      this.resetUnitForm();
      this.loadUnits();
    } catch (error) {
      console.error('Error saving unit:', error);
      const action = this.editingUnit ? 'update' : 'create';
      this.showErrorMessage(`Failed to ${action} unit. Please try again.`);
    } finally {
      this.isSubmitting = false;
    }
  }

  editUnit(unit: Unit) {
    this.unitForm = { ...unit };
    this.editingUnit = true;
    this.clearMessages();
  }

  async deleteUnit(id: number): Promise<void> {
    if (!confirm('Are you sure you want to delete this unit?')) {
      return;
    }

    this.isSubmitting = true;
    this.clearMessages();

    try {
      await this.unitService.delete(id).toPromise();
      this.showSuccessMessage('Unit deleted successfully!');
      this.loadUnits();
    } catch (error) {
      console.error('Error deleting unit:', error);
      this.showErrorMessage('Failed to delete unit. Please try again.');
    } finally {
      this.isSubmitting = false;
    }
  }

  resetUnitForm() {
    this.unitForm = { unitId: 0, name: '', reason: '' };
    this.editingUnit = false;
  }

  // Helper methods
  filterCities(provinceId: number, cities: City[]): City[] {
    if(!provinceId) return cities
    return this.cities.filter(c => c.provinceId === provinceId);
  }

  filterSuburbs(cityId: number, suburbs: Suburb[]): Suburb[] {
    if(!cityId) return suburbs
    return this.suburbs.filter(s => s.cityId === cityId);
  }
  
  getProvinceName(provinceId: number){
    return this.provnices.find(p => p.provinceId === provinceId)?.name || '-'
  }

  getCityName(cityId: number){
    return this.provnices.find(p => p.provinceId === cityId)?.name || '-'
  }

  getSuburbName(suburbId: number){
    return this.provnices.find(p => p.provinceId === suburbId)?.name || '-'
  }

  goBack() {
    this.location.back();
  }
}
 