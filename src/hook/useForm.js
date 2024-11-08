import { useState } from 'react';

// Exporta el hook personalizado useForm que recibe un objeto inicial como argumento (por defecto es un objeto vacío).
export const useForm = (initialForm = {}) => {
	// Declara un estado 'formState' y una función para actualizarlo 'setFormState', inicializándolo con 'initialForm'.
	const [formState, setFormState] = useState(initialForm);

	// Define una función 'onInputChange' que recibe un evento y desestructura el objeto 'target'.
	const onInputChange = ({ target }) => {
		// Extrae 'name' y 'value' del objeto 'target'.
		const { name, value } = target;

		// Actualiza el estado del formulario.
		setFormState({
			// Mantiene el estado anterior del formulario.
			...formState,
			// Actualiza el valor del campo correspondiente al 'name' con el nuevo 'value'.
			[name]: value,
		});
	};

	// Define una función 'onResetForm' para reiniciar el formulario.
	const onResetForm = () => {
		// Restablece el estado del formulario al valor inicial.
		setFormState(initialForm);
	};

	return {
		// Desestructura y devuelve todas las propiedades del estado del formulario.
		...formState,
		// También devuelve el estado completo del formulario.
		formState,
		// Devuelve la función para manejar cambios en los inputs.
		onInputChange,
		// Devuelve la función para reiniciar el formulario.
		onResetForm,
	};
};