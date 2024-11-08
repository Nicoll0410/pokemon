import { useContext } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { PokemonContext } from '../context/PokemonContext';

export const Navigation = () => {
	// Desestructura las funciones y el estado del contexto PokemonContext.
	const { onInputChange, valueSearch, onResetForm } =
		// Usa el contexto PokemonContext.
		useContext(PokemonContext);

	// Inicializa el hook useNavigate para la navegación programática.
	const navigate = useNavigate();

	// Define la función que se ejecuta al enviar el formulario de búsqueda.
	const onSearchSubmit = e => {
		// Previene el comportamiento por defecto del formulario (recargar la página).
		e.preventDefault();
		// Navega a la ruta '/search'.
		navigate('/search', {
			// Pasa el valor de búsqueda actual como estado a la nueva ruta.
			state: valueSearch,
		});

		// Llama a la función onResetForm para restablecer el formulario.
		onResetForm();
	};

	return (
		<>
			<header className='container'>
				<Link to='/' className='logo'>
					<img
						src='/public/logo.png'
						alt='Logo'
					/>
				</Link>

				{/* Crea un formulario que llama a onSearchSubmit al enviarse. */}
				<form onSubmit={onSearchSubmit}>
					<div className='form-group'>
						{/* Comienza la etiqueta SVG para el icono de búsqueda. */}
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth='1.5'
							stroke='currentColor'
							className='icon-search'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
							/>
						</svg>
						<input
							type='search'
							name='valueSearch'
							// Deja el ID vacío (podría ser útil asignar uno).
							id=''
							// Establece el valor del campo al estado valueSearch.
							value={valueSearch}
							// Asigna la función onInputChange para manejar cambios en el campo.
							onChange={onInputChange}
							placeholder='Buscar nombre de pokemon'
						/>
					</div>

					{/* Crea un botón para enviar el formulario */}
					<button className='btn-search'>Buscar</button>
				</form>
			</header>

			{/* Renderiza el componente Outlet para mostrar las rutas secundarias. */}
			<Outlet />
		</>
	);
};