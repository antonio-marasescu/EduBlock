import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {debounceTime, tap} from 'rxjs/operators';
import {
  SmartStudentsListFilterOptionsComponent,
  StudentFilterOptions
} from './smart-students-list-filter-options.component';
import {EduStudentModel} from '../../../../core/models/students/edu-student.model';

describe('SmartStudentsListFilterOptionsComponent', () => {
  let component: SmartStudentsListFilterOptionsComponent;
  let fixture: ComponentFixture<SmartStudentsListFilterOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [SmartStudentsListFilterOptionsComponent],
      providers: []
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartStudentsListFilterOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should call filter data on form value change', (done) => {
    component.ngOnInit();
    const spy = spyOn(component, 'filterData');
    component.filterForm.valueChanges.pipe(debounceTime(170), tap(() => {
      expect(spy).toHaveBeenCalledWith({filterValue: 'any', filterType: StudentFilterOptions.ByPublicKey});
      done();
    })).subscribe();
    component.filterForm.patchValue({filterValue: 'any', filterType: StudentFilterOptions.ByPublicKey});
  });

  it('should filter data on form value change', (done) => {
    component.ngOnInit();
    component.data = [{publicKey: 'not-filtered-any'} as EduStudentModel, {publicKey: 'filtered'} as EduStudentModel];
    component.filter.subscribe(value => {
      expect(value).toEqual([{publicKey: 'not-filtered-any'} as EduStudentModel]);
      done();
    });
    component.filterForm.patchValue({filterValue: 'any', filterType: StudentFilterOptions.ByPublicKey});
  });
});
