// app/swagger/page.tsx
'use client'; // This component needs to be a client component

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import 'swagger-ui-react/swagger-ui.css';

// Dynamically import SwaggerUI to ensure it's client-side rendered
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function SwaggerPage() {
  const [spec, setSpec] = useState<any>(null);

  useEffect(() => {
    async function fetchSpec() {
      const response = await fetch('/api/swagger');
      const data = await response.json();
      setSpec(data);
    }
    fetchSpec();
  }, []);

  if (!spec) {
    return <div>Loading Swagger documentation...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>API Documentation</h1>
      <SwaggerUI spec={spec} />
    </div>
  );
}