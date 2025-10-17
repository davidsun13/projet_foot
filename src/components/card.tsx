import React from 'react';

export type CardField = { label: string; value: React.ReactNode };

export type CardProps<T = any> = {
  id?: string | number;
  title?: string;
  subtitle?: string;
  image?: string;
  icon?: string;             
  fields?: CardField[];
  tags?: string[];
  data?: T;
  onEdit?: (data?: T) => void;
  onDelete?: (id?: string | number) => void;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

export default function Card<T = any>({
  id,
  title,
  subtitle,
  image,
  icon,
  fields,
  tags,
  data,
  onEdit,
  onDelete,
  actions,
  children,
  className = '',
}: CardProps<T>) {
  return (
    <article className={`bg-white rounded-lg shadow p-4 overflow-hidden ${className}`}>
      {image && (
        <div className="w-full h-40 md:h-48 overflow-hidden rounded-md mb-4">
          <img src={image} alt={title || 'image'} className="w-full h-full object-cover" />
        </div>
      )}

      <header className="mb-2 flex items-start justify-between">
        <div className="flex items-center">
          {icon && (
            <img src={icon} alt={`${title}-icon`} className="w-8 h-8 mr-3 object-contain" />
          )}
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {tags?.map((t, i) => (
            <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              {t}
            </span>
          ))}
        </div>
      </header>

      <div className="mb-4">
        {fields && fields.length > 0 ? (
          <dl className="grid grid-cols-1 gap-2 text-sm text-gray-700">
            {fields.map((f, i) => (
              <div key={i} className="flex justify-between">
                <dt className="font-medium text-gray-600">{f.label}</dt>
                <dd className="ml-2">{f.value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          children || (data && <pre className="text-xs text-gray-500 overflow-auto">{JSON.stringify(data, null, 2)}</pre>)
        )}
      </div>

      <footer className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(data)}
              className="text-sm px-3 py-1 rounded bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
            >
              Éditer
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(id)}
              className="text-sm px-3 py-1 rounded bg-red-100 text-red-800 hover:bg-red-200"
            >
              Supprimer
            </button>
          )}
        </div>

        {actions && <div>{actions}</div>}
      </footer>
    </article>
  );
}