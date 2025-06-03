.PHONY: install dev prod clean

install:
	cd backend_autocred && python -m venv .venv && \
	.\.venv\Scripts\activate && pip install -r requirements.txt
	cd frontend_bolt && npm install

dev:
	start cmd /c "cd backend_autocred && .\.venv\Scripts\activate && uvicorn main:app --reload --port 8000"
	start cmd /c "cd frontend_bolt && npm run dev"
	@echo "💡 Ambiente local pronto para testes — abra http://localhost:5173"

prod:
	cd frontend_bolt && npm run build
	xcopy /E /I /Y frontend_bolt\dist\* backend_autocred\static
	cd backend_autocred && .\.venv\Scripts\activate && uvicorn main:app --host 0.0.0.0 --port 8000

clean:
	rm -rf backend_autocred/.venv
	rm -rf frontend_bolt/node_modules
	rm -rf frontend_bolt/dist
	rm -rf backend_autocred/static/* 