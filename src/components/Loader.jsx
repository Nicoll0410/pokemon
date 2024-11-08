import 'ldrs/orbit'

export const Loader = () => {
    return (
        <div className='container-loader'>
            <l-orbit
                size="35"
                speed="1.5"
                color="black"
            ></l-orbit>
        </div>
    )
}