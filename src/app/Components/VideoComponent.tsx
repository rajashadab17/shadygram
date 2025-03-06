"use client";
import { IKVideo } from "imagekitio-next";
import Link from "next/link";
import { IVideo } from "@/models/Video";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { useNotification } from "./Notification";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function VideoComponent({ video }: { video: IVideo }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [likes, setLikes] = useState<number>(video.likes || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [likedBy, setlikedBy] = useState<any>([])
  const { showNotification } = useNotification();

  useEffect(() => {
    setIsLiking(video.liked?.some(user => user.likedBy == session?.user.email ? true : false))
    setlikedBy(video.liked)
  }, [])

  const handleLike = async () => {

    if (session?.user.email) {
      setIsLiking(like => !like)
      try {
        if (isLiking) {
          console.log(session?.user.email)
          const response: any = await apiClient.dislikeVideo(video._id, session?.user.email)
          console.log(response.likedBy)
          console.log(response)

          setLikes(Number(response.likes));
          return;
        }

        const response: any = await apiClient.likeVideo(video._id, session?.user.email)
        console.log(response.likedBy)

        setLikes(Number(response.likes));
      } catch (error) {
        showNotification(error, "error");
      }
    } else {
      router.push('/register')
    }
  };

  return (
    <div className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300">
      <figure className="relative px-4 pt-4">
        <Link href={`/videos/${video._id}`} className="relative group w-full">
          <div
            className="rounded-xl overflow-hidden relative w-full"
            style={{ aspectRatio: "9/16" }}
          >
            <IKVideo
              path={video.videoUrl}
              transformation={[
                {
                  height: "1920",
                  width: "1080",
                },
              ]}
              controls={video.controls}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
      </figure>

      <div className="card-body p-4">
        <Link
          href={`/videos/${video._id}`}
          className="hover:opacity-80 transition-opacity"
        >
          <h2 className="card-title text-lg">{video.title}</h2>
        </Link>

        <p className="text-sm text-base-content/70 line-clamp-2">
          {video.description}
        </p>

        {/* Like Button */}
        <div className="flex items-center space-x-2">
          <Heart
            fill={isLiking ? "red" : "none"}
            className={`cursor-pointer ${isLiking ? "opacity-50" : ""}`}
            onClick={handleLike}
          />
          <p className="text-sm text-base-content/70">{likes}</p>
        </div>
          <p className="text-sm text-base-10">Liked By</p>
          {
            likedBy && likedBy.map((liker:any, index:number) => {
              return <p key={index} className="text-xs text-base-content/70">{liker.likedBy}</p>
            })
          }
          
          
      </div>
    </div>
  );
}
