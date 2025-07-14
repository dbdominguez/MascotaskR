describe('Página de Hábitos', () => {
  beforeEach(() => {
    cy.clearLocalStorage('habitos');
  });

  it('debería crear un hábito y mostrarlo en la lista', () => {
    // 1. Ir a la página
    cy.visit('http://localhost:8100/registro');

    // 2. Llenar campos de texto
    cy.get('ion-input[formControlName="nombre"] input').type('Juan Pérez');
    cy.get('ion-input[formControlName="correo"] input').type('juanprueba2@email.com');
    cy.get('ion-input[formControlName="clave"] input').type('Contra5!');

    cy.wait(500);

    // 3. Seleccionar género
    cy.get('ion-select[formControlName="genero"]').click({ force: true });

    // Espera 
    cy.wait(500);

    cy.get('ion-alert').should('exist');
    cy.get('ion-alert button').contains('Masculino').click({ force: true });
    cy.get('ion-alert button').contains('OK').click({ force: true });

    // Espera 
    cy.wait(500);

    // 4. Seleccionar fecha de nacimiento
    cy.get('ion-datetime[formControlName="fecha_nacimiento"]').then($el => {
      const datetime = $el[0] as HTMLIonDatetimeElement;
      datetime.value = '2000-01-01';
      datetime.dispatchEvent(new Event('ionChange'));
    });

    // Espera 
    cy.wait(500);

    // 5. Enviar formulario
    cy.get('ion-button[type="submit"]').should('not.be.disabled').click();

    // 6. Esperar navegación al home
    cy.url().should('include', '/home');

    //7. Esperar
    cy.wait(2000);

    cy.visit('/tabs/habitos');

    cy.wait(1000);

    cy.get('[data-testid="btn-abrir-formulario"]').click();

    //8. Nombre

    cy.get('[data-testid="input-nombre"] input').type('Tomar agua');

    //9. Categoria
    cy.get('[data-testid="select-categoria"]').click();

    cy.wait(1000);

    cy.get('ion-popover').should('exist').within(() => {
      cy.contains('Ejercicio').click();
    });

    cy.get('ion-popover').should('not.exist');

      // Espera 
    cy.wait(500);

    //10. Dias

    cy.get('[data-testid="select-dias"]').click();

    cy.get('ion-popover').should('exist').within(() => {
      cy.contains('Lunes').click();
      cy.contains('Miércoles').click();
    });

      // Espera 500ms (para que se procese la selección)
    cy.wait(500);

      // Fuerza cerrar popover con JS
    cy.window().then(win => {
      const popover = win.document.querySelector('ion-popover');
      if (popover) {
        popover.dismiss();
      }
    });

    cy.get('ion-popover').should('not.exist');

    //11. Hora
    cy.get('[data-testid="input-hora"]').clear().type('08:30');

    cy.get('[data-testid="btn-guardar"]').click();

    cy.contains('Tomar agua').should('exist');

    cy.wait(1000);
  });
});