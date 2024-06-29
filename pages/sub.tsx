import { Otp } from "@/components/otp/Otp";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useState } from "react";

export default function Sub(props) {
  const [hide, setHide] = useState(true);
  const { toast } = useToast();

  console.log("searchParams", props);

  const { data, isFetching } = useQuery({
    queryKey: ["config"],
    queryFn: async () => {
      const yamlConfig = await fetch("/api/sub");
      const data = await yamlConfig.text();
      return data;
    },
    enabled: !hide,
  });

  const onCopy = (data?: string) => {
    if (!data) return;
    toast({
      title: "Copied",
      description: "The data has been copied to the clipboard",
    });
    navigator.clipboard.writeText(data);
  };

  if (hide) {
    return (
      <Otp
        onSuccess={() => {
          setHide(false);
        }}
        onFail={() => {
          setHide(true);
        }}
      />
    );
  }

  return (
    <section>
      {isFetching ? (
        <Loader size="2rem" />
      ) : (
        <div className="grid place-items-center h-screen w-screen">
          <ScrollArea className="h-[300px] w-[800px] rounded-md bordered p-4">
            <pre>{data}</pre>
          </ScrollArea>
          <div>
            <Button onClick={() => onCopy(data)}>Copy</Button>
          </div>
        </div>
      )}
    </section>
  );
}
