"use client";

import React from "react";
import type { CardProps } from "@heroui/react";
import { cn } from "@heroui/react";
import { Card, CardBody, CardFooter, Button, Avatar, Chip } from "@heroui/react";
import MyTooltip from "./MyTooltip";
import IconForAI from "./IconForAI";

type ModelCardProps = {
  icon: string;
  label: string;
  description: string;
  modelCompany: string;
  website: string;
  className?: string;
  CardProps?: CardProps
}

export default function ModelCard(props: ModelCardProps) {
  const { icon, label, description, modelCompany, website, className, ...rest } = props;
  return (
    <Card className={cn("max-w-[320px] border-small border-default-100 p-3", className)} shadow="sm" {...rest}>
      <CardBody className="px-4 pb-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex max-w-[80%] flex-col gap-1">
            <p className="text-medium font-medium">{label}</p>
            {/* <p className="text-small text-default-500">{description}</p> */}
          </div>
          <Avatar className="bg-content2 text-large" icon={<IconForAI name={icon} />} />
        </div>
        <MyTooltip
          content={description}
          textEllipsis
          lineClamp={5}
        >
          <span className="text-small text-default-500">{description}</span>
        </MyTooltip>
      </CardBody>
      <CardFooter className="justify-between gap-2">
        <Button size="sm" variant="faded" onPress={() => window.open(website, '_blank')}>
          官网
        </Button>
        <Chip
          classNames={{
            dot: 'bg-[#a877ea]',
          }}
          variant="dot">
          {modelCompany}
        </Chip>
      </CardFooter>
    </Card>
  );
}
