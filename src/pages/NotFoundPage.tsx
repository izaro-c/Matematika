import { NotFoundState } from '../components/ui/NotFoundState';

export const NotFoundPage = () => {
  return (
    <NotFoundState
      title="Página no encontrada"
      message="La ruta solicitada no existe en la Biblioteca."
      showHomeLink
    />
  );
};
