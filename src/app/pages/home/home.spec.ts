import { provideHttpClient } from '@angular/common/http';

import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { Home } from './home';


describe('Home', () => {

  let component: Home;

  let fixture: ComponentFixture<Home>;

  let httpTesting: HttpTestingController;


  beforeEach(async () => {

    await TestBed.configureTestingModule({

      imports: [
        Home,
      ],

      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ], // Verwendet eine simulierte HTTP-Verbindung für den Test.

    }).compileComponents();


    fixture = TestBed.createComponent(Home);

    component = fixture.componentInstance;

    httpTesting =
      TestBed.inject(HttpTestingController);

    fixture.detectChanges();


    const request = httpTesting.expectOne(
      'http://localhost:3000/api/outfits'
    ); // Erwartet die Anfrage zum Laden der Outfits.

    request.flush([]); // Sendet eine leere Outfit-Liste als Testantwort.

  });


  afterEach(() => {

    httpTesting.verify(); // Prüft, ob alle HTTP-Anfragen beantwortet wurden.

  });


  it('should create', () => {

    expect(component).toBeTruthy();

  });

});