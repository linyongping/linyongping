import ReactQueryProvider from "@/app/react-query-provider";

type LayoutProps = {
  Component: React.ComponentType;
  pageProps: any;
};

export default function Layout({ Component, pageProps }: LayoutProps) {
  return (
    <ReactQueryProvider>
      <Component {...pageProps} />
    </ReactQueryProvider>
  );
}
