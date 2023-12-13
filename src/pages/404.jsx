import * as React from "react";
import { Link } from "gatsby";
import Layout from "../components/Layout";
import Seo from "../components/SEO";

export default function NotFoundPage() {
  return (
    <Layout noChanges track={false}>
      <main className="text-center">
        <h1 className="font-bold text-2xl mb-2">Page not found</h1>
        <button className="border-black" type="button">
          <Link to="/">Go home</Link>
        </button>
      </main>
    </Layout>
  );
}

export function Head() {
  return <Seo title="Page not found" />;
}
