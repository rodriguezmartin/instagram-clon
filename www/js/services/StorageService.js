angular.module('instagram.services')
/**
 * Este servicio va a administrar el almacenamiento de datos de la app.
 * Acciones necesarias:
 * - Leer
 * - Guardar / almacenar
 * - Borrar
 * - Verificar existencia
 */
.service('StorageService', [
  function() {
    /**
     * Almacena un valor.
     * @param {string} key
     * @param {*} value
     */
    this.set = function(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    };

    /**
     * Obtiene un valor almacenado.
     * @param {string} key
     * @return {*}
     */
    this.get = function(key) {
        return JSON.parse(localStorage.getItem(key));
    };

    /**
     * Verifica si tiene la key.
     * @param {string} key
     * @returns {boolean}
     */
    this.has = function(key) {
        return localStorage.getItem(key) !== null;
    };

    /**
     * Elimina el valor.
     * @param {string} key
     */
    this.delete = function(key) {
        localStorage.removeItem(key);
    };
  }
]);