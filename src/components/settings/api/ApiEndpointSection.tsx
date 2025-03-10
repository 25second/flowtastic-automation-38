
import React from "react";
import { ApiEndpoint } from "./apiEndpoints";
import { ApiEndpointCard } from "./ApiEndpointCard";

interface ApiEndpointSectionProps {
  title: string;
  endpoints: ApiEndpoint[];
}

export function ApiEndpointSection({ title, endpoints }: ApiEndpointSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="space-y-4">
        {endpoints.map((endpoint, index) => (
          <ApiEndpointCard key={index} {...endpoint} />
        ))}
      </div>
    </div>
  );
}
