import { Heart, MapPinIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";

function CardSkeleton() {
  return (
    <Card className="flex flex-col relative ">
      <CardHeader className="flex animate-pulse">
        <CardTitle className="flex justify-between font-bold">
          <div className="h-6 bg-gray-900 rounded w-full " />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 flex-1 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="w-1/4">
            {/* <div className="h-14 bg-gray-900 rounded-full w-14 " /> */}
            <svg className="w-14 h-14 text-gray-200 dark:text-gray-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
        </svg>
          </div>
          <div className="w-3/4 flex flex-col gap-2">
            <div className="h-4 bg-gray-900 rounded  " />
            <div className="h-4 bg-gray-900 rounded w-5/6  " />
          </div>
        </div>
        <hr className="mt-2" />
        <div className="flex flex-col gap-2 w-full">
          <div className="h-3 bg-gray-900 rounded w-5/6  mt-4" />
          <div className="h-4 bg-gray-900 rounded  " />
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 animate-pulse items-center">
      <div className="h-10 w-full bg-gray-900 rounded  " />

        <Button variant="outline" className="w-15">
          <Heart size={20} className="text-gray-400 cursor-auto" fill="gray"  />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default CardSkeleton;
