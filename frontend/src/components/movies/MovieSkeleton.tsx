import { Skeleton } from "primereact/skeleton";
import { Card } from "primereact/card";

export default function MovieSkeleton() {
  return (
    <Card
      className="movie-card"
      style={{
        borderRadius: "8px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: "1px solid #e0e0e0",
      }}
    >
      <div className="movie-card-header">
        <Skeleton width="70%" height="1.5rem" style={{ marginBottom: "1rem" }} />
      </div>
      <div className="movie-card-content" style={{ flex: 1 }}>
        <Skeleton width="100%" height="400px" borderRadius="4px" />
        <Skeleton
          width="60%"
          height="1rem"
          style={{ marginTop: "0.75rem" }}
        />
        <Skeleton width="40%" height="0.875rem" style={{ marginTop: "0.5rem" }} />
      </div>
      <div className="movie-card-footer" style={{ marginTop: "1rem" }}>
        <Skeleton width="100%" height="2.5rem" borderRadius="4px" />
      </div>
    </Card>
  );
}
