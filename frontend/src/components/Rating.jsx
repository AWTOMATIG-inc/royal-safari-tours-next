import { Icon } from "@iconify/react";

export default function Rating({ rating, className }) {
  const arr = Array.from({ length: 5 }, (v, i) => {
    let index = i + 0.5;
    return (
      <span key={i}>
        {Number(rating) >= i + 1 ? (
          <Icon
            key={index}
            width="20"
            height="20"
            icon="solar:star-bold"
            className={className}
          />
        ) : Number(rating) >= index ? (
          <Icon
            key={index}
            width="20"
            height="20"
            icon="mingcute:star-half-fill"
            className={className}
          />
        ) : (
          <Icon
            key={index}
            width="20"
            height="20"
            icon="codicon:star-empty"
            className={className}
          />
        )}
      </span>
    );
  });

  return <div className="flex gap-x-1 items-center">{arr}</div>;
}
