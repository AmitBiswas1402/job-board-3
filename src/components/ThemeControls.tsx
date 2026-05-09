"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

const ThemeControls = () => {
  const [style, setStyle] = useState("cinematic");
  const [mood, setMood] = useState("energetic");
  const [intensity, setIntensity] = useState([50]);
  const [saturation, setSaturation] = useState([60]);

  const handleReset = () => {
    setStyle("cinematic");
    setMood("energetic");
    setIntensity([50]);
    setSaturation([60]);
  };

  const handleSave = () => {
    // TODO: Save theme settings to backend
    console.log("Theme settings saved:", {
      style,
      mood,
      intensity: intensity[0],
      saturation: saturation[0],
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-3">
        <Label htmlFor="theme-style" className="text-sm font-semibold">
          Visual Style
        </Label>
        <Select value={style} onValueChange={setStyle}>
          <SelectTrigger id="theme-style" className="bg-muted/50">
            <SelectValue placeholder="Select a style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cinematic">🎬 Cinematic</SelectItem>
            <SelectItem value="minimalist">✨ Minimalist</SelectItem>
            <SelectItem value="vintage">🎞️ Vintage</SelectItem>
            <SelectItem value="corporate">💼 Corporate</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Choose how your video should look visually
        </p>
      </div>

      <div className="space-y-3">
        <Label htmlFor="theme-mood" className="text-sm font-semibold">
          Mood & Tone
        </Label>
        <Select value={mood} onValueChange={setMood}>
          <SelectTrigger id="theme-mood" className="bg-muted/50">
            <SelectValue placeholder="Select a mood" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="energetic">⚡ Energetic</SelectItem>
            <SelectItem value="calm">🧘 Calm</SelectItem>
            <SelectItem value="dramatic">🎭 Dramatic</SelectItem>
            <SelectItem value="uplifting">🌟 Uplifting</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Set the emotional tone of your video
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">Color Intensity</Label>
          <span className="text-sm font-medium text-muted-foreground">
            {intensity[0]}%
          </span>
        </div>
        <Slider
          value={intensity}
          onValueChange={setIntensity}
          max={100}
          step={5}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          Control how vibrant your colors are
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">Saturation Level</Label>
          <span className="text-sm font-medium text-muted-foreground">
            {saturation[0]}%
          </span>
        </div>
        <Slider
          value={saturation}
          onValueChange={setSaturation}
          max={100}
          step={5}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          Adjust the color saturation
        </p>
      </div>

      {/* Color Presets */}
      <div className="space-y-3 pt-4 border-t">
        <Label className="text-sm font-semibold">Color Presets</Label>
        <div className="grid grid-cols-4 gap-2">
          {[
            { name: "Warm", color: "bg-gradient-to-br from-orange-400 to-red-500" },
            { name: "Cool", color: "bg-gradient-to-br from-blue-400 to-cyan-500" },
            { name: "Purple", color: "bg-gradient-to-br from-purple-400 to-pink-500" },
            { name: "Green", color: "bg-gradient-to-br from-green-400 to-emerald-500" },
          ].map((preset) => (
            <button
              key={preset.name}
              className={`h-10 rounded-lg ${preset.color} hover:scale-105 transition-transform`}
              title={preset.name}
            />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t">
        <Button variant="outline" size="sm" className="flex-1" onClick={handleReset}>
          Reset
        </Button>
        <Button size="sm" className="flex-1" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default ThemeControls;
