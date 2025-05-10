import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { AnimeSurge } from "@/components/anime-surge/AnimeSurge";
import { AnimeReelForm } from "@/components/anime-surge/AnimeReelForm";

export default function AnimeSurgePage() {
  const [activeTab, setActiveTab] = useState<string>("gallery");
  
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-foreground sm:text-3xl sm:truncate font-poppins">
            Anime Surge
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Anime-themed motivation reels to boost your energy and focus
          </p>
        </div>
        
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <Button 
            onClick={() => setActiveTab("add")}
            className={activeTab !== "add" ? "bg-primary/80 hover:bg-primary" : ""}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Reel
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full md:w-auto grid-cols-2 mb-4">
          <TabsTrigger value="gallery" className="text-sm md:text-base">
            Reels Gallery
          </TabsTrigger>
          <TabsTrigger value="add" className="text-sm md:text-base">
            Add New Reel
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="gallery" className="space-y-4">
          <AnimeSurge />
        </TabsContent>
        
        <TabsContent value="add" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Anime Reels</CardTitle>
              <CardDescription>
                Upload new anime-themed motivational reels with quotes and character information
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <AnimeReelForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}