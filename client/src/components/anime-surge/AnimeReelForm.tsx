import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useAnimeReels } from "@/hooks/useAnimeReels";
import { insertAnimeReelSchema } from "@shared/schema";

// Extend the schema with additional validation
const animeReelFormSchema = insertAnimeReelSchema.extend({
  video_url: z.string().url({ message: "Please enter a valid video URL" }),
  thumbnail_url: z.string().url({ message: "Please enter a valid thumbnail URL" }),
  quote: z.string().min(10, { message: "Quote must be at least 10 characters" }).max(200, { message: "Quote must be at most 200 characters" }),
  character: z.string().min(2, { message: "Character name must be at least 2 characters" }),
  source_account: z.string().min(1, { message: "Source account is required" }).regex(/^[a-zA-Z0-9._]{1,30}$/, { message: "Please enter a valid Instagram handle without the @ symbol" }),
});

type FormValues = z.infer<typeof animeReelFormSchema>;

export function AnimeReelForm() {
  const { createReelMutation } = useAnimeReels();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(animeReelFormSchema),
    defaultValues: {
      video_url: "",
      thumbnail_url: "",
      quote: "",
      character: "",
      source_account: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    createReelMutation.mutate(data, {
      onSuccess: () => {
        form.reset();
        setPreviewUrl(null);
      },
    });
  };

  // Update preview when thumbnail URL changes
  const handleThumbnailChange = (value: string) => {
    if (z.string().url().safeParse(value).success) {
      setPreviewUrl(value);
    } else {
      setPreviewUrl(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Anime Reel</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="video_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/video.mp4" {...field} />
                      </FormControl>
                      <FormDescription>
                        Direct video URL (MP4 format preferred)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="thumbnail_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thumbnail URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com/thumbnail.jpg" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(e);
                            handleThumbnailChange(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Preview image URL (JPG, PNG, WebP)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quote"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quote</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter the motivational quote" 
                          className="resize-none min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="character"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Character</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Gojo Satoru" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="source_account"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram Source</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. anime_motivation" {...field} />
                      </FormControl>
                      <FormDescription>
                        Instagram handle without @ symbol
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {previewUrl && (
                  <div className="mt-4">
                    <p className="text-sm mb-2 text-muted-foreground">Thumbnail Preview:</p>
                    <div className="relative w-full h-48 bg-black rounded-md overflow-hidden">
                      <img
                        src={previewUrl}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                        onError={() => setPreviewUrl(null)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <CardFooter className="px-0 pt-4">
              <Button 
                type="submit" 
                className="w-full glow-effect"
                disabled={createReelMutation.isPending}
              >
                {createReelMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Add Anime Reel"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}