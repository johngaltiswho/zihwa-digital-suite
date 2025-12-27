"use client";

import { useState } from "react";
import type { OngoingProject } from "@/data/ongoingProjects";
import MapPlaceholder from "./MapPlaceholder";

interface Props {
  projects: OngoingProject[];
}

export default function OngoingProjects({ projects }: Props) {
  const [activeId, setActiveId] = useState(projects[0]?.id);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* LEFT: ONGOING PROJECTS */}
      <div className="lg:col-span-5">
        <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-white shadow-xl border overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b bg-white">
            <h3 className="text-lg font-semibold tracking-wide text-gray-900">
              Ongoing Projects
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Live infrastructure works in progress
            </p>
          </div>

          {/* List */}
          <div className="max-h-[420px] overflow-y-auto">
            {projects.map((project) => {
              const active = project.id === activeId;

              return (
                <div
                  key={project.id}
                  onClick={() => setActiveId(project.id)}
                  className={`group cursor-pointer px-6 py-5 transition-all border-l-4 ${
                    active
                      ? "border-red-700 bg-red-50/60"
                      : "border-transparent hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {/* TITLE — ALWAYS RED */}
                  <h4
                    className={`transition ${
                      active
                        ? "text-red-800 font-semibold"
                        : "text-red-700"
                    }`}
                  >
                    {project.title}
                  </h4>

                  {/* DESCRIPTION */}
                  <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                    {project.description}
                  </p>

                  {/* ACTIVE INDICATOR */}
                  {active && (
                    <div className="mt-3 h-[2px] w-12 bg-red-700 rounded-full" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT: MAP */}
      <div className="lg:col-span-7">
        <div className="h-[440px] rounded-2xl overflow-hidden border shadow-xl bg-white">
          <MapPlaceholder />
        </div>
      </div>
    </div>
  );
}
