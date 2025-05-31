import StatCard from "./StatCard";
import StatCardSkeleton from "../../../../components/ui/skeletons/StatCardSkeleton";
import { DiscAlbum, ListMusic, Users } from "lucide-react";
import { useStats } from "../../../../hooks/stat.hook";

const Stats = () => {
  const {data : stats , isLoading} = useStats()

  const cards = [
    { icon: DiscAlbum, title: "Total Albums", count: stats?.totalAlbums, color: "bg-success text-success-content" },
    { icon: Users, title: "Total Users", count: stats?.totalUsers, color: "bg-primary text-primary-content" },
    { icon: Users, title: "Total Artists", count: stats?.uniqueArtists, color: "bg-neutral text-neutral-content" },
    { icon: ListMusic, title: "Total Songs", count: stats?.totalSongs, color: "bg-error text-error-content" },
  ];

  return (
    <div className="mt-6 sm:mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 p-3 sm:p-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          : cards.map((card, i) => (
              <StatCard
                key={i}
                icon={card.icon}
                title={card.title}
                count={card.count ?? 0}
                color={card.color}
              />
            ))}
      </div>
    </div>
  );
};

export default Stats;