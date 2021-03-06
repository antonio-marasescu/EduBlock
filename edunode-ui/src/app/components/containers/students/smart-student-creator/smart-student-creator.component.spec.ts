import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Store} from '@ngrx/store';
import {TestStore} from '../../../../store/test/test.store';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {AddStudent} from '../../../../store/actions/students.actions';
import {EduStudentModel} from '../../../../core/models/students/edu-student.model';
import {SmartStudentCreatorComponent, StudentCreatorActionTypes} from './smart-student-creator.component';
import {JsonPipe} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';

describe('SmartStudentCreatorComponent', () => {
  let component: SmartStudentCreatorComponent;
  let fixture: ComponentFixture<SmartStudentCreatorComponent>;
  let mockStore;
  let router: Router;

  beforeEach(async(() => {
    mockStore = new TestStore();
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([
        {path: 'records', component: SmartStudentCreatorComponent},
        {path: '', component: SmartStudentCreatorComponent}
      ])],
      declarations: [SmartStudentCreatorComponent],
      providers: [
        {
          provide: JsonPipe,
          useValue: {
            transform: (value) => JSON.stringify(value)
          }
        },
        {
          provide: MatSnackBar,
          useValue: {
            open: (x, y, z) => x
          }
        },
        {
          provide: Store,
          useValue: mockStore
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.get(Router);
    fixture = TestBed.createComponent(SmartStudentCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should set actions button to valid on valid form data', () => {
    const payload: EduStudentModel = {publicKey: 'pk', fullName: 'i1', groupId: '30441', faculty: 'ac'};
    component.ngOnInit();
    component.form.patchValue({...payload, privateKey: 'sk'});
    expect(component.form.valid).toBe(true);
    expect(component.actions[3].valid).toBe(true);
  });

  it('should dispatch Add Student on Create Event', () => {
    const payload: EduStudentModel = {publicKey: 'pk', fullName: 'i1', groupId: '30441', faculty: 'ac'};
    component.ngOnInit();
    spyOn(mockStore, 'dispatch');
    component.form.patchValue({...payload, privateKey: 'sk'});
    component.onAction(StudentCreatorActionTypes.CREATE);
    expect(mockStore.dispatch).toHaveBeenCalledWith(new AddStudent(payload));
  });

  it('should copy keys to clipboard on Export Event', () => {
    spyOn(navigator.clipboard, 'writeText');
    component.form.patchValue({publicKey: 'pk', privateKey: 'sk'});
    component.onAction(StudentCreatorActionTypes.EXPORT);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(JSON.stringify({publicKey: 'pk', privateKey: 'sk'}));
  });

  it('should navigate back to students list on Exit Event', () => {
    spyOn(router, 'navigateByUrl');
    component.onAction(StudentCreatorActionTypes.EXIT);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/students');
  });

  it('should start generation of public and private key on Generate Event', () => {
    spyOn(component, 'generatePublicPrivateKey');
    component.onAction(StudentCreatorActionTypes.GENERATE);
    expect(component.generatePublicPrivateKey).toHaveBeenCalledWith();
  });
});
