import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By

# Cambia la URL según tu entorno local o de pruebas
def test_contact_form():
    driver = webdriver.Chrome()
    driver.get('http://localhost:3000/pages/contacto.html')

    # Rellena el formulario de contacto (ajusta los selectores según tu HTML)
    driver.find_element(By.NAME, 'name').send_keys('Test User')
    driver.find_element(By.NAME, 'email').send_keys('test@example.com')
    driver.find_element(By.NAME, 'message').send_keys('Mensaje de prueba')
    driver.find_element(By.CSS_SELECTOR, 'form button[type=submit]').click()

    # Espera y verifica el mensaje de éxito (ajusta el selector y texto esperado)
    success = driver.find_element(By.CLASS_NAME, 'success-message')
    assert 'Gracias' in success.text
    driver.quit()
