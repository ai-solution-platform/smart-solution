'use client';

import { useState } from 'react';
import {
  GripVertical,
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Globe,
} from 'lucide-react';

export interface MenuItem {
  id: string;
  labelTh: string;
  labelEn: string;
  url: string;
  icon?: string;
  target: '_self' | '_blank';
  children: MenuItem[];
  isExpanded?: boolean;
}

interface MenuBuilderProps {
  items: MenuItem[];
  onChange: (items: MenuItem[]) => void;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
}

function MenuItemRow({
  item,
  depth,
  onToggle,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  onIndent,
  onOutdent,
}: {
  item: MenuItem;
  depth: number;
  onToggle: (id: string) => void;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onIndent: (id: string) => void;
  onOutdent: (id: string) => void;
}) {
  const hasChildren = item.children.length > 0;

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-2.5 px-3 bg-white border border-gray-200 rounded-lg mb-1.5 hover:shadow-sm transition-shadow group`}
        style={{ marginLeft: `${depth * 28}px` }}
      >
        {/* Drag handle */}
        <GripVertical className="w-4 h-4 text-gray-300 cursor-grab flex-shrink-0" />

        {/* Expand/collapse */}
        {hasChildren ? (
          <button
            type="button"
            onClick={() => onToggle(item.id)}
            className="p-0.5 hover:bg-gray-100 rounded"
          >
            {item.isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
        ) : (
          <div className="w-5" />
        )}

        {/* Depth indicator */}
        {depth > 0 && (
          <div className="flex items-center gap-0.5">
            {Array.from({ length: depth }).map((_, i) => (
              <div key={i} className="w-1 h-4 bg-gov-200 rounded-full" />
            ))}
          </div>
        )}

        {/* Label */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-800 truncate">{item.labelTh}</span>
            {item.labelEn && (
              <span className="text-xs text-gray-400 truncate">({item.labelEn})</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Globe className="w-3 h-3" />
            <span className="truncate">{item.url}</span>
            {item.target === '_blank' && <ExternalLink className="w-3 h-3 text-gray-300" />}
          </div>
        </div>

        {/* Reorder buttons */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onMoveUp(item.id)}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
            title="เลื่อนขึ้น"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onMoveDown(item.id)}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
            title="เลื่อนลง"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onIndent(item.id)}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
            title="เพิ่มระดับ"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onOutdent(item.id)}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
            title="ลดระดับ"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-4 bg-gray-200 mx-1" />
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="p-1 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded"
            title="แก้ไข"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(item.id)}
            className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
            title="ลบ"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && item.isExpanded && (
        <div>
          {item.children.map((child) => (
            <MenuItemRow
              key={child.id}
              item={child}
              depth={depth + 1}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              onIndent={onIndent}
              onOutdent={onOutdent}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MenuBuilder({ items, onChange, onEdit, onDelete }: MenuBuilderProps) {
  const toggleExpand = (id: string) => {
    const toggle = (menuItems: MenuItem[]): MenuItem[] =>
      menuItems.map((item) => ({
        ...item,
        isExpanded: item.id === id ? !item.isExpanded : item.isExpanded,
        children: toggle(item.children),
      }));
    onChange(toggle(items));
  };

  const moveUp = (id: string) => {
    const move = (menuItems: MenuItem[]): MenuItem[] => {
      const idx = menuItems.findIndex((item) => item.id === id);
      if (idx > 0) {
        const newItems = [...menuItems];
        [newItems[idx - 1], newItems[idx]] = [newItems[idx], newItems[idx - 1]];
        return newItems;
      }
      return menuItems.map((item) => ({ ...item, children: move(item.children) }));
    };
    onChange(move(items));
  };

  const moveDown = (id: string) => {
    const move = (menuItems: MenuItem[]): MenuItem[] => {
      const idx = menuItems.findIndex((item) => item.id === id);
      if (idx >= 0 && idx < menuItems.length - 1) {
        const newItems = [...menuItems];
        [newItems[idx], newItems[idx + 1]] = [newItems[idx + 1], newItems[idx]];
        return newItems;
      }
      return menuItems.map((item) => ({ ...item, children: move(item.children) }));
    };
    onChange(move(items));
  };

  const indent = (id: string) => {
    const doIndent = (menuItems: MenuItem[]): MenuItem[] => {
      const idx = menuItems.findIndex((item) => item.id === id);
      if (idx > 0) {
        const newItems = [...menuItems];
        const target = newItems.splice(idx, 1)[0];
        newItems[idx - 1] = {
          ...newItems[idx - 1],
          children: [...newItems[idx - 1].children, target],
          isExpanded: true,
        };
        return newItems;
      }
      return menuItems.map((item) => ({ ...item, children: doIndent(item.children) }));
    };
    onChange(doIndent(items));
  };

  const outdent = (id: string) => {
    const doOutdent = (menuItems: MenuItem[], parent?: MenuItem[]): MenuItem[] => {
      for (let i = 0; i < menuItems.length; i++) {
        const childIdx = menuItems[i].children.findIndex((c) => c.id === id);
        if (childIdx >= 0 && parent) {
          const target = menuItems[i].children[childIdx];
          const newChildren = menuItems[i].children.filter((_, ci) => ci !== childIdx);
          const newParent = [...parent];
          const parentIdx = newParent.findIndex((p) => p.id === menuItems[i].id);
          newParent[parentIdx] = { ...newParent[parentIdx], children: newChildren };
          newParent.splice(parentIdx + 1, 0, target);
          return newParent;
        }
        const result = doOutdent(menuItems[i].children, menuItems);
        if (result !== menuItems[i].children) {
          if (parent) return result;
          return result;
        }
      }
      return menuItems;
    };
    onChange(doOutdent(items));
  };

  return (
    <div className="space-y-1">
      {items.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Globe className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">ยังไม่มีรายการเมนู</p>
          <p className="text-xs mt-1">คลิก &quot;เพิ่มเมนู&quot; เพื่อเริ่มสร้างเมนู</p>
        </div>
      ) : (
        items.map((item) => (
          <MenuItemRow
            key={item.id}
            item={item}
            depth={0}
            onToggle={toggleExpand}
            onEdit={onEdit}
            onDelete={onDelete}
            onMoveUp={moveUp}
            onMoveDown={moveDown}
            onIndent={indent}
            onOutdent={outdent}
          />
        ))
      )}
    </div>
  );
}
