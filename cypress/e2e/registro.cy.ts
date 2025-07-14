describe('Flujo de Registro', () => {
  it('debería registrar un usuario y redirigir al home', () => {
    // 1. Ir a la página
    cy.visit('http://localhost:8100/registro');

    cy.wait(1000);

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
    cy.url({ timeout: 5000 }).should('include', '/home');
  });
});