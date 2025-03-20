"use client";

import React from "react";
import type { CardProps } from "@heroui/react";
import { cn } from "@heroui/react";
import { Card, CardBody, CardFooter, Button, Avatar, Chip } from "@heroui/react";
import MyTooltip from "./MyTooltip";
import IconForAI from "./IconForAI";
import { i18nAtom, I18nKey, useAtomValue } from "@/i18n";
import { langAtom } from "@/store";
type ModelCardProps = {
  icon: string;
  label: string;
  description: string;
  descriptionEn: string;
  modelCompany: string;
  modelCompanyEn: string;
  website: string;
  className?: string;
  CardProps?: CardProps
}

export default function ModelCard(props: ModelCardProps) {
  const i18n = useAtomValue(i18nAtom);
  const lang = useAtomValue(langAtom);
  const { icon, label, description, descriptionEn, modelCompany, modelCompanyEn, website, className, ...rest } = props;
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
          content={lang === 'zh_cn' ? description : descriptionEn}
          textEllipsis
          lineClamp={5}
        >
          <span className="text-small text-default-500">{lang === 'zh_cn' ? description : descriptionEn}</span>
        </MyTooltip>
      </CardBody>
      <CardFooter className="justify-between gap-2">
        <Button size="sm" variant="faded" onPress={() => window.open(website, '_blank')}>
          {i18n[I18nKey.website]}
        </Button>
        <Chip
          classNames={{
            dot: 'bg-[#a877ea]',
          }}
          variant="dot">
          {lang === 'zh_cn' ? modelCompany : modelCompanyEn}
        </Chip>
      </CardFooter>
    </Card>
  );
}
