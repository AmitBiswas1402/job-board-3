import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

const JobsOverview = async () => {
  return (
    <div className="p-6">
      <div className="flex items-end justify-end">
        <Link href={"/admin/create"}>
          <Button>
            <Plus className="w-5 h-5" /> New Job
          </Button>
        </Link>
      </div>

      {/* Table */}
      
    </div>
  );
};
export default JobsOverview;
