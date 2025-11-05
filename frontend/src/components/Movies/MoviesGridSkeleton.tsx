import MovieSkeleton from "./MovieSkeleton";

export default function MoviesGridSkeleton() {
  return (
    <div className="movies-skeleton-grid">
      {Array.from({ length: 6 }).map((_, index) => (
        <MovieSkeleton key={index} />
      ))}
      <style>{`
        .movies-skeleton-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
          margin: 1.5rem 0;
        }

        @media (max-width: 768px) {
          .movies-skeleton-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
