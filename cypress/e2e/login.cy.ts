describe('Página de Login', () => {
  beforeEach(() => {
    cy.visit('/login');

    // Asegura usuario válido
    cy.window().then((win) => {
      win.localStorage.setItem(
        'usuarios',
        JSON.stringify([
          {
            nombre: 'Juan',
            genero: 'Masculino',
            fecha_nacimiento: '2000-01-01',
            correo: 'juanprueba@email.com',
            clave: 'Contra5!'
          }
        ])
      );
    });
  });

  it('debería iniciar sesión y redirigir al home', () => {
    cy.get('[data-testid="email-input"]')
      .find('input') // SIN shadow()
      .type('juanprueba@email.com');

    cy.get('[data-testid="clave-input"]')
      .find('input')
      .type('Contra5!');

    cy.get('ion-button[type="submit"]').click();

    cy.url({ timeout: 5000 }).should('include', '/home');
  });
});