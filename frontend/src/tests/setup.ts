// @testing-library/jest-dom ajoute des matchers personnalisés à expect() :
//   - toBeInTheDocument() : vérifie que l'élément est dans le DOM
//   - toHaveProperty()    : vérifie la présence d'une prop
//   - toBeDisabled()      : vérifie que l'élément est désactivé
//   - toHaveValue()       : vérifie la valeur d'un input
//   etc.
// Sans cet import, ces matchers ne seraient pas disponibles dans les tests.
import '@testing-library/jest-dom'