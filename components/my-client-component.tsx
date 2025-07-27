'use client'
import { Button } from "./ui/button";

export function MyClientComponent() {
  return <Button className="cursor-pointer" onClick={() => alert(1)}>Test</Button>
}
